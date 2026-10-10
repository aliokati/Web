import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {50:'#f1f6f4',100:'#e4f2f0',200:'#cadcde',300:'#b4cdd0',400:'#92aeb5',500:'#73939e',600:'#4c727f',700:'#315462',800:'#1c3e4d',900:'#0c2a37',950:'#061923'},
        sky: {50:'#effafb',100:'#def5f6',200:'#b6eef0',300:'#8bdee5',400:'#73d5df',500:'#4b97a5',600:'#287789',700:'#1d5e6e',800:'#17475a',900:'#123447',950:'#0a2333'},
        background: "var(--background)",
        foreground: "var(--foreground)",
        sleep: {
          50: "#f0f4f8",
          100: "#dbe3ec",
          200: "#bdcbe0",
          300: "#92abcc",
          400: "#6185b3",
          500: "#416796",
          600: "#325078",
          700: "#294060",
          800: "#253751",
          900: "#0f172a", // Deep midnight base
          950: "#0e1118" // Calming dark sleep sky
        },
        accent: {
          glow: "#38bdf8",
          soft: "#a5b4fc"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        farsi: ["var(--font-farsi)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
