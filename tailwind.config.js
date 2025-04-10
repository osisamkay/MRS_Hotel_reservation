/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'mrs-blue': '#26355D',
        'mrs-gray': '#D9D9D9',
        'navy': {
          700: '#26355D',
        },
        indigo: {
          900: '#2A3158', // Custom color for Moose Rock brand
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-averia)', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'inner-custom': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'custom': '10px',
      },
    },
  },
  plugins: [],
}