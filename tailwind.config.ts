import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0f172a",
          accent: "#356df3",
          sand: "#f3ede1"
        }
      },
      boxShadow: {
        card: "0px 20px 45px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        card: "24px"
      }
    }
  },
  plugins: []
};

export default config;
