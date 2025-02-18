/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': 'Inter',
      },
      colors: {
        'gray': {
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      backgroundImage: {
        'card-bg': "url('/background-blur.png')",
        'cardback-bg': "url('/backgroundback-blur.png')",
      },
    },
  },
  plugins: [],
}

