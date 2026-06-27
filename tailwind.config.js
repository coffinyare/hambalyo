/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          ivory: '#FAF9F6',       // Soft, rich background
          gold: '#D4AF37',        // Accents, borders, badges
          goldLight: '#F3ECE0',   // Badge backgrounds
          burgundy: '#5B1E31',    // Hero headings, premium CTAs
          charcoal: '#2D2D2D',    // Body text for high readability
        }
      },
      fontFamily: {
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
