import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#0F2745",
        panel: "#EAF4FB",
        steel: "#425D78",
        signal: "#127CDB",
        power: "#00C6D7",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        glow: "0 28px 82px rgba(15, 39, 69, 0.13)",
      },
    },
  },
  plugins: [],
};

export default config;
