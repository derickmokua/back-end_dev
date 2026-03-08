import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import chatHandler from './api/chat.js'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'configure-server',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', async () => {
                try {
                  req.body = JSON.parse(body);

                  // Mock res.status and res.json for the Vercel handler
                  res.status = (code) => {
                    res.statusCode = code;
                    return res;
                  };
                  res.json = (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return res;
                  };

                  // Run the handler
                  await chatHandler(req, res);
                } catch (error) {
                  console.error('Middleware error:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    base: '/',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    build: {
      sourcemap: true
    }
  }
})
// Last deployed: Sun Jan 4 2026
