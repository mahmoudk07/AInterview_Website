/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "rgba(0,21,52,255",
        "secondary-color": "#98C1D9",
        "tertiary-color": "#E0FBFC",
        "quaternary-color": "#293241",
        borderColor: "#033772",
        backgroundColor: "rgba(0,21,52,255)",
        success: "#20bb75",
      },
      fontFamily: {
        "neue-plak": ["Neue Plak", "sans-serif"],
      },
    },
  },
  plugins: [],
});

