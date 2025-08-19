/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
  extend: {
    fontFamily: {
      josefin: ["var(--font-josefin)", "sans-serif"],
    },
  },
},
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
}
