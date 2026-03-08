import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", "[data-theme='dark']"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "midnight-slate": "#0F172A",
        "paper-white": "#F8F9FA",
        "pure-white": "#FFFFFF",
        "slate-600": "#475569",
        "slate-400": "#94A3B8",
        "slate-200": "#E2E8F0",
        "accent-gold": "#D4AF37",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Inter",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
