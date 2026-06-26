import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        neo: {
          cream: "#FFF8E7",
          "light-yellow": "#FFF3C4",
          green: "#4CAF50",
          blue: "#2196F3",
          yellow: "#FFC107",
          red: "#F44336",
          white: "#FFFFFF",
          black: "#1A1A1A",
          "gray-100": "#F5F5F5",
          "gray-200": "#E0E0E0",
          "gray-300": "#BDBDBD",
          "gray-600": "#757575",
          "gray-800": "#424242",
        },
      },
      borderWidth: {
        "4": "4px",
      },
      borderRadius: {
        "16": "16px",
      },
      boxShadow: {
        neo: "6px 6px 0px 0px #1A1A1A",
        "neo-sm": "4px 4px 0px 0px #1A1A1A",
        "neo-hover": "8px 8px 0px 0px #1A1A1A",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
