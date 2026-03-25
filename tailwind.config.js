/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { background: 'rgb(var(--color-bg) / <alpha-value>)', surface: 'rgb(var(--color-surface) / <alpha-value>)', accent: 'rgb(var(--color-accent) / <alpha-value>)', 'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)', 'tx-main': 'rgb(var(--color-tx-main) / <alpha-value>)', 'tx-muted': 'rgb(var(--color-tx-muted) / <alpha-value>)', bd: 'rgb(var(--color-bd) / <alpha-value>)', },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
