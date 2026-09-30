import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#08080A",
        white: "#FFFFFF",
        yellow: {
          DEFAULT: "#FFE500",
          400: "#FFF266",
          500: "#FFE500",
          600: "#E6CE00",
          accent: "#FFE500",
          subtle: "rgba(255, 229, 0, 0.12)",
        },
        surface: {
          ground: "#FFFFFF",
          subtle: "#F7F7F8",
          muted: "#EFEFF1",
          elevated: "#FFFFFF",
          dark: "#08080A",
          darkSubtle: "#121216",
        },
        editorial: {
          black: "#08080A",
          charcoal: "#222226",
          muted: "#6B6B76",
          light: "#9A9AA4",
          hairline: "rgba(8, 8, 10, 0.08)",
          hairlineStrong: "rgba(8, 8, 10, 0.16)",
        },
      },
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        elevation: "0 2px 10px rgba(0,0,0,0.03), 0 10px 30px rgba(0,0,0,0.04)",
        floating: "0 8px 30px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.05)",
        highlight: "0 0 0 1px #FFE500, 0 4px 20px rgba(255,229,0,0.25)",
        softPill: "0 2px 8px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
