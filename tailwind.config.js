/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#F8F7F4',
          100: '#F2F2EF',
          200: '#E3E0D7'
        },
        onyx: '#1C1C1C',
        gold: '#C5A059'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      letterSpacing: {
        relaxed: '0.02em'
      },
      boxShadow: {
        card: '0 8px 30px rgba(12, 12, 12, 0.08)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out'
      }
    },
  },
  plugins: [],
};
