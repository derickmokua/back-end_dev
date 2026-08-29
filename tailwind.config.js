module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff9e6',
          100: '#ffedb3',
          200: '#ffe080',
          300: '#ffd44d',
          400: '#ffc71a',
          500: '#e6b000', // Main gold
          600: '#b38900',
          700: '#806200',
          800: '#4d3b00',
          900: '#1a1400',
        },
        terminal: {
          bg: '#08090E',
          card: '#0F121A',
          cardHover: '#161B26',
          green: '#00FF9F', // Neon Cyber Emerald (Primary CTA, terminal prompts, online status)
          cyan: '#00E5FF',  // Electric Cyber Cyan (Secondary accents, links, articles)
          red: '#FF3B56',   // Vivid Crimson Security Red (Alerts, security tags)
          amber: '#FFB800', // Terminal Gold
          text: '#F1F5F9',  // High-contrast readable body text
          muted: '#94A3B8', // Readable secondary text (passes WCAG AA)
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}