/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf2f8",
          600: "#1f618d",
          700: "#1a5276",
          800: "#154360",
        },
      },
    },
  },
  plugins: [],
};
