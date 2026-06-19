import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#102033",
        panel: "#f5f9fd",
        steel: "#5e7086",
        signal: "#1688c7",
        power: "#45a9c8",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 70px rgba(15, 41, 76, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
