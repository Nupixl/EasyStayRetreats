/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      screens: {
        DEFAULT: "1760px",
      },
      padding: {
        DEFAULT: "4rem",
      },
    },
    extend: {
      colors: {
        overlayColor: "rgb(16 21 33 / 20%)",
        primaryColor: "#1f7a8c",
        secondaryColor: "#f4d35e",
        surfaceMuted: "#f1f5f7",
        searchBackground: "#edf2f4",
        blackColor: "#1d2a30",
        lightTextColor: "#607584",
        borderColor: "#d5e0e6",
        darkBorderColor: "#9fb3c1",
        lightBorderColor: "#e6eff2",
      },
    },
  },
  plugins: [],
};
