/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensures Tailwind scans all your files in `src`
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Circular", "Helvetica", "Arial", "sans-serif"], // Set Circular as default sans-serif
        circular: ["Circular", "sans-serif"], // Custom class for Circular
        serif: ["Garamond Premier Pro", "Times New Roman", "serif"], // For section titles
      },
    },
  },
  plugins: [],
};
