/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Open Sans', 'sans-serif']
    },
    extend: {
      gridTemplateColumns: {
        'flexible': 'repeat(auto-fit,minmax(320px, 1fr))',
      },
      gridTemplateRows: {
        '2-a': '2rem 1fr'
      },
      lineHeight: {
        'zero': '0',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
