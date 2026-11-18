/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563EB", 50: "#EFF4FF", 700: "#1D4ED8" },
        ink: "#111827",
        canvas: "#F8FAFC",
        line: "#E5E7EB",
        success: "#16A34A",
        muted: "#5B6474",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Cairo"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
