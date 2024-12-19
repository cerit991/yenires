/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'success': {
          '0%': { 
            transform: 'scale(0.8)',
            opacity: '0'
          },
          '50%': { 
            transform: 'scale(1.1)',
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'success': 'success 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
