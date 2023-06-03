/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/processes/*.{ts,tsx}",
    "./src/shared/ui/**/*.{ts,tsx}",
    "./src/widgets/**/*.{ts,tsx}",
    "./src/entities/**/ui/*.{ts,tsx}",
    "./src/entities/**/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        iblue: {
          400: "#248bf5",
          500: "#248bf5",
          600: "#248bf5",
          700: "#177ce0",
        },
        igray: "#e5e5ea",
      },
      backgroundColor: {
        iblue: {
          400: "#248bf5",
          500: "#248bf5",
          600: "#248bf5",
          700: "#177ce0",
        },
        igray: "#e5e5ea",
      },
    },
  },
  plugins: [],
}
