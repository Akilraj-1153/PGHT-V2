/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '0px',    // No minimum width
      'sm': '640px',  // Minimum width: 640px
      'md': '768px',  // Minimum width: 768px
      'lg': '1024px', // Minimum width: 1024px
      'xl': '1280px', // Minimum width: 1280px
      '2xl': '1536px' // Minimum width: 1536px
    },
    extend: {
      fontFamily:{
        mateSc:["Mate SC, serif"],
        mate:["Mate, serif"],
        Protest:['Protest Revolution ,sans-serif'],
        Roboto:['Roboto Mono,monospace'],
      },
    },
    backgroundImage:{
      Home:"url('./Assets/HomeImg.png')"
    }
  },
  plugins: [],
}
