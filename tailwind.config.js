/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        body: "rgb(var(--bg-body) / <alpha-value>)",
        card: "rgb(var(--bg-card) / <alpha-value>)",
        accent: "rgb(var(--bg-accent) / <alpha-value>)",
        inverse: "rgb(var(--bg-inverse) / <alpha-value>)",
        "text-main": "rgb(var(--text-main) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted) / <alpha-value>)",
        "text-inverse": "rgb(var(--text-inverse) / <alpha-value>)",
        "border-color": "rgb(var(--border-color) / <alpha-value>)",
        "pastel-blue": "rgb(var(--pastel-blue) / <alpha-value>)",
        "pastel-yellow": "rgb(var(--pastel-yellow) / <alpha-value>)",
        "pastel-pink": "rgb(var(--pastel-pink) / <alpha-value>)",
        "pastel-orange": "rgb(var(--pastel-orange) / <alpha-value>)",
        "pastel-green": "rgb(var(--pastel-green) / <alpha-value>)",
        "pastel-purple": "rgb(var(--pastel-purple) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.03)',
        'dribbble': '0 16px 32px -8px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
