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
        brand: {
          bg: "#09090b",
          surface: "#111115",
          surfaceHover: "#18181e",
          border: "rgba(255, 255, 255, 0.08)",
          borderBright: "rgba(255, 255, 255, 0.2)",
          muted: "#71717a",
          subtle: "#a1a1aa",
          light: "#fafafa",
        },
        vibrant: {
          green: "#22c55e",
          greenGlow: "rgba(34, 197, 94, 0.4)",
          amber: "#f59e0b",
          amberGlow: "rgba(245, 158, 11, 0.4)",
          ruby: "#f43f5e",
          rubyGlow: "rgba(244, 63, 94, 0.4)",
          violet: "#a855f7",
          violetGlow: "rgba(168, 85, 247, 0.4)",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
