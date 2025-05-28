
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
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
        secondary: {
          50: "#F8F9FA",
          100: "#F1F3F4",
          200: "#E8EAED",
          300: "#DADCE0",
          400: "#BDC1C6",
          500: "#9AA0A6",
          600: "#80868B",
          700: "#5F6368",
          800: "#3C4043",
          900: "#202124",
          DEFAULT: "#F1F3F4",
          foreground: "#3C4043",
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
        destructive: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
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
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      boxShadow: {
        'warm': 'var(--shadow-warm)',
        'warm-lg': 'var(--shadow-warm-lg)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 