import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import chatHandler from './api/chat.js'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Inline CSS into index.html so PSI doesn't flag /assets/*.css as
 * render-blocking (portfolio CSS is small — fine to inline).
 */
function inlineCssIntoHtml() {
  return {
    name: 'inline-css-into-html',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      const htmlPath = join(dist, 'index.html')
      if (!existsSync(htmlPath)) return

      let html = readFileSync(htmlPath, 'utf-8')
      const assetsDir = join(dist, 'assets')
      if (!existsSync(assetsDir)) return

      const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'))

      for (const cssFile of cssFiles) {
        const css = readFileSync(join(assetsDir, cssFile), 'utf-8')
        // Match any stylesheet link whose href ends with this css filename
        const linkRe = new RegExp(
          `<link\\b[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*${cssFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*/?>|<link\\b[^>]*href=["'][^"']*${cssFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*rel=["']stylesheet["'][^>]*/?>`,
          'gi'
        )
        const next = html.replace(linkRe, `<style>${css}</style>`)
        if (next !== html) {
          html = next
          try {
            unlinkSync(join(assetsDir, cssFile))
          } catch {
            /* HTML no longer links it */
          }
        }
      }

      writeFileSync(htmlPath, html)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      inlineCssIntoHtml(),
      {
        name: 'configure-server',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = ''
              req.on('data', (chunk) => {
                body += chunk.toString()
              })

              req.on('end', async () => {
                try {
                  req.body = JSON.parse(body)

                  res.status = (code) => {
                    res.statusCode = code
                    return res
                  }
                  res.json = (data) => {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(data))
                    return res
                  }

                  await chatHandler(req, res)
                } catch (error) {
                  console.error('Middleware error:', error)
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: 'Internal Server Error' }))
                }
              })
            } else {
              next()
            }
          })
        },
      },
    ],
    base: '/',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      // No source maps in production — smaller download, cleaner PSI
      sourcemap: false,
      cssCodeSplit: false,
      // Keep fonts as separate files (not base64 in HTML) for better caching & smaller HTML
      assetsInlineLimit: 0,
      modulePreload: {
        // Avoid modulepreload of lazy chat/blog chunks on first paint
        resolveDependencies: (filename, deps) => {
          return deps.filter(
            (dep) =>
              !/RubyChatbot|BlogModal|ChatPage|purify|marked/i.test(dep)
          )
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('framer-motion')) return 'motion'
              if (id.includes('lucide-react')) return 'icons'
              if (id.includes('dompurify') || id.includes('marked')) return 'markdown'
              if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
                return 'react-vendor'
              }
            }
          },
        },
      },
    },
  }
})
