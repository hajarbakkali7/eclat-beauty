/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cormorant': ['Cormorant Garamond', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'eclat-gold': '#C9A96A',
        'eclat-beige': '#FDF8F5',
        'eclat-black': '#1A1A1A',
      }
    },
  },
  plugins: [],
}