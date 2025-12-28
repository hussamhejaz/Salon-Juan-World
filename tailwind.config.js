export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette derived from logo (gold + brown)
        amber: {
          50:  "#F9F2E6",
          100: "#F4E5C8",
          200: "#E9D6B0",
          300: "#E0C59A",
          400: "#CDAA81",
          500: "#C58239", // Primary gold
          600: "#A96C32",
          700: "#8B7057", // Bronze tone
          800: "#704E38",
          900: "#55392A"  // Primary brown
        },
        brandBrown: {
          50:  "#F5EEE8",
          100: "#EBDDCF",
          200: "#D1B8A1",
          300: "#B28F75",
          400: "#8B7057",
          500: "#55392A",
          600: "#4A2F24",
          700: "#3C241B",
          800: "#2F1B14",
          900: "#23120D"
        },
        brandBeige: "#CDAA81",
        brandCream: "#F4E5C8",
        ink:    "#0f172a",
        cloud:  "#f8fafc",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        "sans-ar": ["var(--font-sans-ar)"],
      },
    },
  },
  plugins: [],
};
