export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#152131',
        'navy-light': '#293647',
        'gold-accent': '#C5A059',
        'light-grey': '#E5E7EB',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'raleway': ['Raleway', 'sans-serif'],
      }
    }
  },
  plugins: [],
}