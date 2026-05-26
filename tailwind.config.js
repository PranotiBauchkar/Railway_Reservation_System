/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
          950: '#172554',
        },
        rail: {
          navy: '#0c2d57',
          blue: '#1a4480',
          saffron: '#e67e22',
          orange: '#d35400',
          cream: '#f8f6f1',
          card: '#ffffff',
          border: '#e2e8f0',
          muted: '#64748b',
          success: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(12, 45, 87, 0.12)',
        'card-hover': '0 12px 40px rgba(12, 45, 87, 0.18)',
      },
    },
  },
  plugins: [],
};
