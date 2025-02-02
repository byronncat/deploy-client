/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d81d84',
          50: '#fdf2f9',
          100: '#fde6f5',
          200: '#fdcded',
          300: '#fca5dd',
          400: '#f86ec5',
          500: '#f242ac',
          600: '#d81d84',
          700: '#c4126f',
          800: '#a2125b',
          900: '#87144e',
          950: '#53042b',
        },
        'on-primary': '#ffffff',
        background: '#F0F2F5',
        'on-background': '#000000',
        surface: '#ffffff',
        'on-surface': '#000000',
        success: '#4fbf26',
        error: '#ff002d',
        dark: {
          primary: '#db2f8e',
          'on-primary': '#000000',
          background: '#121212',
          'on-background': '#ffffff',
          surface: '#242526',
          'on-surface': '#ffffff',
          success: '#00C853',
          error: '#f43355',
          divider: '#505151',
        },
        love: '#FF3131',
      },
      fontSize: {
        '10vw': '10vw',
      },
      spacing: {
        12: '3rem', // 48 px
        18: '4.5rem', // 72 px
        34: '8.5rem', // 136 px
        88: '22rem', // 352 px
        92: '23rem', // 368 px
        96: '24rem', // 384 px
        100: '25rem', // 400 px
        108: '27rem', // 432 px
        120: '30rem', // 480 px
        140: '35rem', // 560 px
        160: '40rem', // 640 px
        180: '45rem', // 720 px
        190: '47.5rem', // 760 px
        200: '50rem', // 800 px
        250: '62.5rem', // 1000px
        300: '75rem', // 1200px
        md: '48rem',
        lg: '64rem',
      },
      padding: {
        full: '100%',
      },
      rotate: {
        24: '24deg',
      },
      borderWidth: {
        3: '3px',
      },
      aspectRatio: {
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
};
