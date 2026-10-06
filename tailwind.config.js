/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F1',
        cream2: '#F3EEE3',
        ink: '#15211E',
        pine: '#0E3B34',
        pinedark: '#0A2924',
        moss: '#147A70',
        mosslight: '#E6F1EE',
        sand: '#C8A96A',
        sandlight: '#F2E8D5',
        clay: '#C86B4A',
        stonewarm: '#E9E2D6',
        muted: '#6B7572',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px -12px rgba(21, 33, 30, 0.18)',
        card: '0 8px 30px -10px rgba(21, 33, 30, 0.15)',
        lift: '0 20px 50px -15px rgba(14, 59, 52, 0.35)',
      },
      animation: {
        'float-soft': 'floaty 6s ease-in-out infinite',
        'shimmer': 'shim 2s infinite',
        'toast-in': 'toastIn 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
        'marquee': 'marq 30s linear infinite',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shim: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(100%)' },
        },
        toastIn: {
          'from': { transform: 'translateY(16px) scale(0.96)', opacity: '0' },
          'to': { transform: 'none', opacity: '1' },
        },
        marq: {
          'to': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};
