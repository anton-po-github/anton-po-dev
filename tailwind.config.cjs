/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050510',
          card: 'rgba(13, 17, 38, 0.8)',
          blue: '#00C2FF',
          purple: '#BD00FF',
          green: '#00FF66',
          text: '#E2E8F0',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(to right, #00FF66, #BD00FF)',
        'circuit-pattern':
          'radial-gradient(circle at 50% 50%, rgba(20, 20, 40, 0) 0%, rgba(5, 5, 16, 1) 100%), repeating-linear-gradient(transparent, transparent 2px, rgba(0, 194, 255, 0.03) 2px, rgba(0, 194, 255, 0.03) 4px)',
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 194, 255, 0.5), 0 0 20px rgba(0, 194, 255, 0.2)',
        'neon-purple': '0 0 10px rgba(189, 0, 255, 0.5), 0 0 20px rgba(189, 0, 255, 0.2)',
        'neon-btn': '0 0 15px rgba(0, 255, 102, 0.6)',
      },
    },
  },
  plugins: [],
};
