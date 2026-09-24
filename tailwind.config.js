module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        hand: ['Caveat', 'cursive'],
      },
      colors: {
        bg: '#181818',
        panel: '#202020',
        panelHover: '#252525',
        line: '#343434',
        fg: '#F5F5F3',
        mut: '#A4A4A0',
        acc: {
          DEFAULT: '#FF3B45',
          light: '#FF6870',
          bg: 'rgba(255, 59, 69, 0.12)',
        },
        terminal: {
          bg: '#181818',
          card: '#202020',
          cardHover: '#252525',
          green: '#FF3B45', // Primary Accent Red
          cyan: '#FF6870',  // Secondary Accent
          red: '#FF3B45',
          amber: '#FFB800',
          text: '#F5F5F3',  // Primary Text
          muted: '#A4A4A0', // Muted Text
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}