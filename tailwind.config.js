/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aifa: {
          red: '#D93043',
          'red-hover': '#C02638',
          'red-light': '#FEE8EB',
          dark: '#171B26',
          bg: '#F3F5F9',
          muted: '#667085',
        },
        chrome: {
          tabBg: '#DEE1E6',
          tabActive: '#FFFFFF',
          tabHover: '#E8EAED',
          border: '#D0D5DD',
          toolbar: '#FFFFFF',
          inputBg: '#F1F3F4',
          inputHover: '#E8EAED',
          inputText: '#202124',
          iconDefault: '#5F6368',
        },
        editorial: {
          navy: '#0F1D36',
          accent: '#1E3A8A',
          border: '#E2E8F0',
          paper: '#FAF9F6',
          textMuted: '#64748B',
          leadDark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}

