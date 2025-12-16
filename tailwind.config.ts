import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070909",
        surface: "#0d1113",
        accent: "#6fffe9",
        muted: "#a7b3be",
        border: "#1c252b"
      },
      fontFamily: {
        display: ["var(--font-display)", "Instrument Sans", "Helvetica", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Instrument Sans", "Helvetica", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(111, 255, 233, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
