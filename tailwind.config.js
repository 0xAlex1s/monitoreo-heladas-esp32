/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        primary: '#0D47A1',
        secondary: '#42A5F5',
        surface: 'rgba(30, 41, 59, 0.7)',
        surfaceHover: 'rgba(51, 65, 85, 0.8)'
      },
    },
  },
  plugins: [],
}
