/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'pm': '368px',
      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'md': '960px',
      // => @media (min-width: 960px) { ... }

      'lg': '1440px',
      // => @media (min-width: 1440px) { ... }
    },
    extend: {
      fontFamily:{
        oxa: 'SVN-Hemi Head',
        pop: 'Poppins',
        inter:"Inter"
      },
      clipPath: {
        'custom-polygon': 'polygon(70% 0, 100% 50%, 70% 100%, 0 100%, 0 0)',
      },
     keyframes:{
      showContent:{
        to:{
          transform:' translateY(50px)',
          filter: 'blur(0px)',
          opacity: 0
      }
      
      }
     },
     animation:{
      showContent:'showContent .5s 1s linear 1 forwards'
     }
    },
  },
  plugins: [],
}