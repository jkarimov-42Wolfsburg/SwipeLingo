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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--tg-theme-button-color, #3390ec)",
        "primary-text": "var(--tg-theme-button-text-color, #ffffff)",
        secondary: "var(--tg-theme-secondary-bg-color, #f1f1f1)",
        hint: "var(--tg-theme-hint-color, #999999)",
        link: "var(--tg-theme-link-color, #3390ec)",
        accent: "#ff6b6b",
        success: "#4caf50",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "Helvetica", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
