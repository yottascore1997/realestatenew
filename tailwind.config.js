/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A6E",
          dark: "#0B1A2E",
        },
        sidebar: "#0B1A2E",
        navy: {
          DEFAULT: "#0F0A1A",
          dark: "#080510",
          mid: "#1E1035",
        },
        gold: {
          DEFAULT: "#7C3AED",
          light: "#EDE9FE",
          dark: "#5B21B6",
          rich: "#A78BFA",
        },
        cream: {
          DEFAULT: "#FAFAFC",
          dark: "#F3F0FA",
        },
        royal: "#7C3AED",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
        geist: ["Geist", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
