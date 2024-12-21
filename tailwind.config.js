/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'tomato': '#E63946',
        'sunset': '#F77F00',
        
        // Secondary Colors
        'leafy': '#6A994E',
        'golden': '#FFC300',
        
        // Neutral Base Colors
        'creamy': '#FFF8E1',
        'beige': '#EDE4DB',
        
        // Accent Colors
        'deep-brown': '#6F4E37',
        'soft-blue': '#A8DADC',
      },
      fontFamily: {
        'liber': ['Liber', 'serif'],
      },
    },
  },
  plugins: [],
}

