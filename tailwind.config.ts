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
        panel: "#f6f9fc",
        steel: "#617084",
        signal: "#0faea6",
        power: "#74c947",
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
