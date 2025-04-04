/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a73e8",
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc4fb",
          400: "#36a3f8",
          500: "#1a73e8",
          600: "#0c5cd4",
          700: "#0a4ab3",
          800: "#0a3f94",
          900: "#0a357a",
        },
        secondary: {
          DEFAULT: "#5f6368",
          50: "#f8f9fa",
          100: "#f1f3f4",
          200: "#e8eaed",
          300: "#dadce0",
          400: "#bdc1c6",
          500: "#5f6368",
          600: "#3c4043",
          700: "#202124",
          800: "#1a1d1f",
          900: "#17181a",
        },
        accent: {
          300: "#F7DE9E",
          400: "#F0CC6F",
          500: "#E6B943",
          600: "#DAA520",
          700: "#B8860B",
        },
        neutral: {
          100: "#F5F0ED",
          200: "#BBAC9F",
          300: "#A3877B",
          400: "#8B7267",
          500: "#745E54",
          600: "#5C4A42",
          700: "#453731",
          800: "#2D2420",
          900: "#1A1614",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      spacing: {
        1: "0.25rem" /* 4px */,
        2: "0.5rem" /* 8px */,
        3: "0.75rem" /* 12px */,
        4: "1rem" /* 16px */,
        6: "1.5rem" /* 24px */,
        8: "2rem" /* 32px */,
        12: "3rem" /* 48px */,
        16: "4rem" /* 64px */,
      },
    },
  },
  plugins: [],
};
