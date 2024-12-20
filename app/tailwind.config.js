/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../core/src/**/*.{ts,tsx,js,jsx}",
    "../core/src/**/**/*.{ts,tsx,js,jsx}",
    "../core/src/**/**/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
