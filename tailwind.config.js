/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./imports/**/*.{js,jsx,ts,tsx}",
      "./client/**/*.{js,jsx,ts,tsx,html}"
    ], // Targets Meteor's structure
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#ff6b47',
          'primary-dark': '#e55a3d',
          'primary-foreground': '#ffffff',
          accent: '#fff1ed',
          'accent-foreground': '#8b2500',
          background: '#ffffff',
          foreground: '#1a1a1a',
          section: '#f8f8f8',
          card: '#ffffff',
          'card-foreground': '#1a1a1a',
          muted: '#f8f8f8',
          'muted-foreground': '#6b7280',
          secondary: '#f8f8f8',
          'secondary-foreground': '#1a1a1a',
          border: '#f3d6cc',
          input: '#f3d6cc',
          ring: '#ff6b47',
          destructive: '#dc2626',
          'destructive-foreground': '#ffffff',
          code: {
            keyword: '#e55a3d',
            function: '#ff6b47',
            string: '#d97706',
            comment: 'hsl(220, 9%, 46%)',
            operator: '#dc2626',
          },
          terminal: {
            red: '#dc2626',
            yellow: '#d97706',
            green: '#16a34a',
          },
          chart: {
            1: 'hsl(12, 76%, 61%)',
            2: 'hsl(173, 58%, 39%)',
            3: 'hsl(197, 37%, 24%)',
            4: 'hsl(43, 74%, 66%)',
            5: 'hsl(27, 87%, 67%)',
          },
          sidebar: {
            background: '#f8f8f8',
            foreground: '#1a1a1a',
            primary: '#ff6b47',
            'primary-foreground': '#ffffff',
            accent: '#fff1ed',
            'accent-foreground': '#8b2500',
            border: '#f3d6cc',
            ring: '#ff6b47',
          },
        },
        fontFamily: {
          display: ['Space Grotesk', 'sans-serif'],
          body: ['Space Grotesk', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        borderRadius: {
          sm: '0.125rem',
          md: '0.25rem',
          lg: '0.5rem',
        },
        boxShadow: {
          glow: '0 0 8px rgba(255, 107, 71, 0.4)',
          'glow-intense': '0 0 16px rgba(255, 107, 71, 0.6)',
        },
        backdropBlur: {
          xs: '2px',
          sm: '4px',
          md: '8px',
          lg: '12px',
          xl: '20px',
        },
        backgroundImage: {
          'warm-gradient': 'linear-gradient(135deg, #ff6b47, transparent 30%)',
          'primary-gradient': 'linear-gradient(135deg, #ff6b47 0%, transparent 70%)',
          'hero-radial': 'radial-gradient(circle at 70% 30%, rgba(255, 107, 71, 0.08) 0%, transparent 50%)',
          'cta-radial': 'radial-gradient(circle at center, rgba(255, 107, 71, 0.05) 0%, transparent 70%)',
          'divider-line': 'linear-gradient(90deg, transparent, #ff6b47, transparent)',
        },
        transitionTimingFunction: {
          'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        },
        keyframes: {
          'button-shine': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
        },
        animation: {
          'button-shine': 'button-shine 2s infinite',
        },
      },
    },
    plugins: [
      function ({ addUtilities }) {
        const newUtilities = {
          '.warm-border': {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '0',
              borderRadius: '0.25rem',
              padding: '1px',
              background: 'linear-gradient(135deg, #ff6b47, transparent 30%)',
              '-webkit-mask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              '-webkit-mask-composite': 'xor',
              'mask-composite': 'exclude',
              'pointer-events': 'none',
            },
          },
          '.cyber-border': {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '0',
              borderRadius: '0.25rem',
              padding: '1px',
              background: 'linear-gradient(135deg, #ff6b47, transparent 30%)',
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
              background: '#ff6b47',
              transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
            },
            '&:hover::before': {
              height: '100%',
            },
          },
        };
        addUtilities(newUtilities);
      },
      require('@tailwindcss/typography'),
    ],
  };