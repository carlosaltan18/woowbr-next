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
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
  require('@tailwindcss/typography'),
  require('@tailwindcss/forms'),
  require('@tailwindcss/aspect-ratio'),
],
}
