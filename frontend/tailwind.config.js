/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "rgba(0,21,52,255",
        "secondary-color": "#98C1D9",
        "tertiary-color": "#E0FBFC",
        "quaternary-color": "#293241",
      },
    },
  },
  plugins: [],
};

