/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        cyan: {
          400: '#22d3ee',
        },
        amber: {
          400: '#fbbf24',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.5)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}