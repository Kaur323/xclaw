/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          dark: '#EE5A5A',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          dark: '#3DBDB5',
        },
        dark: {
          DEFAULT: '#0A0E17',
          light: '#1A1F2E',
          lighter: '#2A3142',
        },
        accent: {
          red: '#EE5A5A',
          purple: '#9B59B6',
          blue: '#3498DB',
          green: '#2ECC71',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
