/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sakura-pink': '#F6CECE',
        'bamboo-green': '#7BA17D',
        'indigo-blue': '#3F4B83',
        'sumi-black': '#2A2A2A',
        'accent-gold': '#D4AF37',
      },
      fontFamily: {
        'noto-serif': ['"Noto Serif JP"', 'serif'],
        'sawarabi': ['"Sawarabi Mincho"', 'sans-serif'],
      },
      backgroundImage: {
        'zen-garden': "url('/images/zen-garden-bg.jpg')",
      },
    },
  },
  plugins: [],
};
