
module.exports = {
  content: [
    "./client/**/*.{js,jsx}",
    "./imports/**/*.{js,jsx}",
    "./server/**/*.{js,jsx}",
    "*.{js,jsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Warm color palette
        primary: {
          50: "#FFF4F1",
          100: "#FFE6E0",
          200: "#FFD1C7",
          300: "#FFB3A3",
          400: "#FF8A6D",
          500: "#FF6B47", // Main primary color (warm coral)
          600: "#E55A3D",
          700: "#CC4A32",
          800: "#B33D28",
          900: "#99331F",
          DEFAULT: "#FF6B47",
          foreground: "#FFFFFF",
        },
        accent: {
          50: "#FFF9F7",
          100: "#FFF1ED",
          200: "#FFE4DB",
          300: "#FFD0C1",
          400: "#FFB8A3",
          500: "#FFA085",
          DEFAULT: "#FFF1ED",
          foreground: "#99331F",
        },
        // Custom warm colors
        warm: {
          50: "#FFF9F7",
          100: "#FFF1ED",
          200: "#FFE4DB",
          300: "#FFD0C1",
          400: "#FFB8A3",
          500: "#FF6B47",
          600: "#E55A3D",
          700: "#CC4A32",
          800: "#B33D28",
          900: "#99331F",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

    },
  },
} 