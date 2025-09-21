/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './devlink/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Webflow Color Palette
        'ghost-white': '#fcfcff',
        'black': '#081c3a',
        'shadow': 'rgba(53, 64, 117, 0.1)',
        'outline': '#efeff7',
        'grey-background': '#f7f8fc',
        'dark-outline': '#e6e6f3',
        'body-display': '#516381',
        'indicator-outline': 'rgba(192, 192, 211, 0.2)',
        'teal': '#9bff3e',
        'dodger-blue': '#217dfc',
        'travel-green': '#478760',
        // Additional colors for better contrast
        'primary': '#217dfc',
        'secondary': '#9bff3e',
        'accent': '#478760',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
