/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.tsx"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#129EA1",
          50: "#F0F9FA",
          100: "#D3EBEB", 
          200: "#A6D7D8",
          300: "#7AC3C5",
          400: "#4DAFB2",
          500: "#129EA1",
          600: "#0E7E81",
          700: "#0B5F61",
          800: "#073F40",
          900: "#042020"
        },
        light: "#D3EBEB",
      },
    },
  },
  plugins: [],
}