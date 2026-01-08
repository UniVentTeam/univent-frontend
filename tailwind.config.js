/** @type {import('tailwindcss').Config} */
module.exports = {
  // Safe content globs: index.html, root JSX files, and everything under src
  // This avoids accidental node_modules matching and improves performance.
  content: ["./index.html", "./*.{js,jsx,html}", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};