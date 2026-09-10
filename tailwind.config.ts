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
        botanic: {
          dark: "#08130E",
          emerald: "#0E2419",
          forest: "#163828",
          moss: "#2A573F",
          leaf: "#3E835E",
          sage: "#8FA89B",
          cream: "#FAF7F2",
          sand: "#EFE9DF",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          amber: "#D97706",
          ruby: "#BE123C",
          violet: "#7C3AED",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
