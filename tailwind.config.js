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
      maxHeight: {
        '106': '28rem', 
        '108': '30rem',
        '110': '32rem',
        '112': '34rem',
        '114': '36rem',
        '116': '38rem',
        '118': '40rem',
        '120': '42rem',
        '122': '44rem',
        '124': '46rem',
      },
      minHeight: {
        '106': '28rem', 
        '108': '30rem',
        '110': '32rem',
        '112': '34rem',
        '114': '36rem',
        '116': '38rem',
        '118': '40rem',
        '120': '42rem',
        '122': '44rem',
        '124': '46rem',
      },
      colors: {
        nobleBlack: '#0B0B0B',
        lightNobleBlack: '#1c1c1c',
        softWhite: '#F8F8F8',
        successGreen: '#008f00',
        error: '#d10000',
        sidebarGray: '#333333',
        nobleGold: '#D4AF37',
      },
    },
  },
  plugins: [],
}
