/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../apps/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages-shared/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#FCFDFF',
          2: '#F5F9FF',
          3: '#EAF3FF',
          4: '#DAEBFF',
          5: '#C8E1FF',
          6: '#B3D4FF',
          7: '#9AC2FF',
          8: '#74A9FB',
          9: '#0167E5',
          10: '#0058D5',
          11: '#0065E3',
          12: '#0A3067',
          DEFAULT: '#0167E5'
        },
        blue: {
          1: '#FCFDFF',
          2: '#F5F9FF',
          3: '#EAF3FF',
          4: '#DAEBFF',
          5: '#C8E1FF',
          6: '#B3D4FF',
          7: '#9AC2FF',
          8: '#74A9FB',
          9: '#0167E5',
          10: '#0058D5',
          11: '#0065E3',
          12: '#0A3067',
          DEFAULT: '#0167E5'
        },
        gray: {
          1: '#fcfcfc',
          2: '#f9f9f9',
          3: '#efefef',
          4: '#e8e8e8',
          5: '#e0e0e0',
          6: '#d8d8d8',
          7: '#cecece',
          8: '#bbb',
          9: '#8d8d8d',
          10: '#838383',
          11: '#646464',
          12: '#202020',
          DEFAULT: '#8d8d8d'
        },
        grey: {
          1: '#fcfcfc',
          2: '#f9f9f9',
          3: '#efefef',
          4: '#e8e8e8',
          5: '#e0e0e0',
          6: '#d8d8d8',
          7: '#cecece',
          8: '#bbb',
          9: '#8d8d8d',
          10: '#838383',
          11: '#646464',
          12: '#202020',
          DEFAULT: '#8d8d8d'
        },
        'mobile-background': '#f5f6f8'
      },
      spacing: {
        base: '10px'
      },
      gridTemplateColumns: {
        xs: 'repeat(auto-fill, minmax(200px, 1fr))',
        base: 'repeat(auto-fill, minmax(260px, 1fr))',
        lg: 'repeat(auto-fill, minmax(300px, 1fr))',
        xl: 'repeat(auto-fill, minmax(360px, 1fr))',
        '2xl': 'repeat(auto-fill, minmax(420px, 1fr))',
        '3xl': 'repeat(auto-fill, minmax(480px, 1fr))'
      }
    }
  },
  plugins: [
    function ({ addVariant }) {
      // 添加 `mobile:` 变体，匹配 max-width: 500px
      addVariant('mobile', '@media (max-width: 767px)')
    }
  ]
}
