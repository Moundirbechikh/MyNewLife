/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        lobster: ['"Lobster"', 'cursive'],
        quicksand: ['"Quicksand"', 'sans-serif'],
      },
      screens: {
        se: '320px', // iPhone SE
      },
    },
  },
  plugins: [],
};
