/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sakura: '#F6CECE',
        bamboo: '#7BA17D',
        'bamboo-dark': '#5A8A5C',
        indigo: '#3F4B83',
        sumi: '#2A2A2A',
        softWhite: '#F9F5F0',
        gold: '#D4AF37',
      },
      fontFamily: {
        noto: ['"Noto Serif JP"', 'serif'],
        sawarabi: ['"Sawarabi Mincho"', 'sans-serif'],
        hina: ['"Hina Mincho"', 'cursive'],
      },
      backgroundImage: {
        'zen-garden': "url('/images/zen_garden_bg.jpg')",
      },
    },
  },
  plugins: [],
};
