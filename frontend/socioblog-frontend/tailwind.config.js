/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'reddish-orange': '#FF7871',
        'lightish-pink': '#FF9090',
      },
      width:{
        '70%': "70%",
      },
      height:{
        "one": "1px",
      },
      spacing:{
        '17': '70px',
        '300':'300px'
      },
      flexGrow:{
        0.75:'0.75',
      },
      margin:{
        '10px':'10px',
        '15%': '15%',
        '50%': '50%',
      },
      fontFamily:{
        "roboto":"roboto",
        "poppins": "Poppins"
      },
      fontSize:{
        'twenty':"20px",
        '40px': "40px",
      },
      backgroundImage:{
        'chatBg': 'url(./chats/chatbg.webp)'
      }
    },
  },
  plugins: [],
}