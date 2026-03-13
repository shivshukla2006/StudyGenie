/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-blue)",
        lightBlue: "var(--light-blue)",
        accentGlow: "var(--accent-glow)",
        background: "var(--background)",
      },
      boxShadow: {
        'glow': '0 0 15px rgba(168, 85, 247, 0.5)',
      }
    },
  },
  plugins: [],
}
