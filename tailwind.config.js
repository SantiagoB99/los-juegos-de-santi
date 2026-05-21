// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ludo: {
          beige:  '#F5ECD7',
          brown:  '#3D2B1F',
          orange: '#C4622D',
          olive:  '#6B7C45',
          cream:  '#FDF6E3',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        warm:     '0 2px 12px rgba(61,43,31,0.12)',
        'warm-lg':'0 4px 24px rgba(61,43,31,0.18)',
      },
    },
  },
  plugins: [],
}
