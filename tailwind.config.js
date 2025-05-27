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
        primary: "#2A9D8F",
        light: "#7ED4C6",
        oklch: {
          custom: 'oklch(70.5% 0.015 286.067)',
        },
      },
    },
  },
  plugins: [],
}