/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'primary' : '#1763AD',
      'background' : '#C6D1DC',
      'white' : '#ffffff',
      'red' : '#FF0000',
      'black' : '#000000',
      'warning' : '#DEC804',
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
