/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // remove unused css
  content: [],
  theme: {
    extend: {
      margin: {
        '68': '17rem', 
        '76': '19rem', 
      },
      colors: {
        nobleBlack: '#0B0B0B',
        lightNobleBlack: '#262626',
        sidebarGray: '#333333',
        nobleGold: '#D4AF37',
      },
    },
  },
  plugins: [],
}
