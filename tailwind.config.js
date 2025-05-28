/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./imports/**/*.{js,jsx,ts,tsx}",
      "./client/**/*.{js,jsx,ts,tsx,html}"
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3B82F6', /* Vibrant blue - modern and engaging */
            '50': '#EFF6FF',
            '100': '#DBEAFE',
            '200': '#BFDBFE',
            '300': '#93C5FD',
            '400': '#60A5FA',
            '500': '#3B82F6',
            '600': '#2563EB',
            '700': '#1D4ED8',
            '800': '#1E40AF',
            '900': '#1E3A8A',
          },
          accent: {
            DEFAULT: '#10B981', /* Fresh teal green - crisp and clean */
            '50': '#ECFDF5',
            '100': '#D1FAE5',
            '200': '#A7F3D0',
            '300': '#6EE7B7',
            '400': '#34D399',
            '500': '#10B981',
            '600': '#059669',
            '700': '#047857',
            '800': '#065F46',
            '900': '#064E3B',
          },
          background: '#F9FAFB', /* Very light grey - clean and minimal */
          muted: '#6B7280', /* Medium grey - balanced contrast */
          dark: '#111827', /* Very dark blue-grey - high contrast */
          gray: {
            '50': '#F9FAFB',
            '100': '#F3F4F6',
            '200': '#E5E7EB',
            '300': '#D1D5DB',
            '400': '#9CA3AF',
            '500': '#6B7280',
            '600': '#4B5563',
            '700': '#374151',
            '800': '#1F2937',
            '900': '#111827',
          },
          code: {
            keyword: '#8B5CF6', /* Purple */
            function: '#059669', /* Green */
            string: '#F59E0B', /* Amber */
            comment: '#6B7280', /* Grey */
            operator: '#EF4444', /* Red */
          },
          terminal: {
            red: '#EF4444',
            yellow: '#F59E0B',
            green: '#10B981',
          },
        },
        fontFamily: {
          display: ['"Merriweather"', 'serif'],
          body: ['"Open Sans"', 'sans-serif'],
          mono: ['"Fira Code"', 'monospace'],
        },
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '1rem',
        },
        boxShadow: {
          glow: '0 2px 8px rgba(59, 130, 246, 0.25)',
          'glow-intense': '0 4px 12px rgba(59, 130, 246, 0.35)',
        },
        backdropBlur: {
          xs: '2px',
          sm: '4px',
          md: '8px',
          lg: '12px',
          xl: '20px',
        },
        backgroundImage: {
          'accent-gradient': 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
          'hero-radial': 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
          'cta-radial': 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          'divider-line': 'linear-gradient(90deg, transparent, #3B82F6, transparent)',
          'radial-dots': 'url("data:image/svg+xml;utf8,<svg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'><circle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'%23F0D878\' stroke-width=\'0.5\' stroke-opacity=\'0.2\'/></svg>")',
        },
        transitionTimingFunction: {
          'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        },
        keyframes: {
          'button-shine': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
          'underline-expand': {
            '0%': { width: '0%' },
            '100%': { width: '100%' },
          },
        },
        animation: {
          'button-shine': 'button-shine 2s infinite',
          'underline-expand': 'underline-expand 0.3s ease forwards',
        },
      },
    },
    plugins: [
      function ({ addUtilities }) {
        const newUtilities = {
          '.sunset-border': {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '0',
              borderRadius: '0.5rem',
              padding: '1px',
              background: 'linear-gradient(135deg, #3B82F6, #10B981)',
              '-webkit-mask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              '-webkit-mask-composite': 'xor',
              'mask-composite': 'exclude',
              'pointer-events': 'none',
            },
          },
          '.feature-card-highlight': {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '3px',
              height: '0',
              background: '#3B82F6',
              transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
            },
            '&:hover::before': {
              height: '100%',
            },
          },
          '.text-gradient': {
            background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
            '-webkit-background-clip': 'text',
            'background-clip': 'text',
            color: 'transparent',
          },
          '.underline-animated': {
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-4px',
              left: '0',
              width: '0',
              height: '2px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
              transition: 'width 0.3s ease',
            },
            '&:hover::after': {
              width: '100%',
            },
          },
        };
        addUtilities(newUtilities);
      },
      require('@tailwindcss/typography'),
    ],
  };