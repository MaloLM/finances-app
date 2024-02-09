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
        lightNobleBlack: '#131313',
        nobleGold: '#d4b85b',
        darkerNobleGold: '#998d05',
        lightGray: '#333333',
        softWhite: '#d6d6d6',
        error: '#d10000',
      },
    },
  },
  plugins: [],
}
