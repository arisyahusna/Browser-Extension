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
        // Sebenarnya.my dashboard: warm neutral surfaces, charcoal ink, soft blue/yellow/coral accents
        dash: {
          bg: '#EAE9E6',
          surface: '#F4F3F1',
          line: '#E0DED9',
          ink: '#2A2A2A',
          muted: '#6F6D69',
          blue: '#5774BC',
          'blue-soft': '#9DB2E3',
          'blue-tint': '#DFE6F5',
          'blue-text': '#3F5C9E',
          yellow: '#E8CF85',
          'yellow-tint': '#F4EBCB',
          'yellow-text': '#715C1C',
          coral: '#E9928B',
          'coral-tint': '#F7DEDB',
          'coral-text': '#9B3D36',
          'neutral-tint': '#E8E6E2',
          'neutral-text': '#5C5A56',
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

