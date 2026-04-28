import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Kalam', 'cursive'],
        body: ['Patrick Hand', 'cursive'],
        mono: ['Patrick Hand SC', 'cursive'],
      },
      colors: {
        paper: {
          white: '#FEFDF8',
          cream: '#F9F5E7',
          warm: '#F4EDD3',
          tan: '#E8DFC4',
          aged: '#D4C9A8',
        },
        ink: {
          dark: '#1A1611',
          medium: '#3D3420',
          light: '#6B5B3E',
          faint: '#9B8B6E',
        },
        marker: {
          blue: '#2563EB',
          'blue-light': '#DBEAFE',
          green: '#16A34A',
          'green-light': '#DCFCE7',
          red: '#DC2626',
          'red-light': '#FEE2E2',
          yellow: '#CA8A04',
          'yellow-light': '#FEF9C3',
          purple: '#7C3AED',
          'purple-light': '#EDE9FE',
          orange: '#EA580C',
          'orange-light': '#FFEDD5',
        },
        sticky: {
          yellow: '#FEF08A',
          pink: '#FBCFE8',
          blue: '#BAE6FD',
          green: '#BBF7D0',
          purple: '#DDD6FE',
        },
      },
      borderRadius: {
        sketch: '255px 15px 225px 15px / 15px 225px 15px 255px',
        'sketch-sm': '2px 8px 2px 6px / 8px 2px 6px 2px',
        wobbly: '12px 4px 10px 6px / 4px 12px 6px 10px',
        sticky: '3px 3px 3px 3px / 3px 3px 15px 3px',
      },
      boxShadow: {
        'sketch-sm': '3px 3px 0px #1A1611',
        sketch: '5px 5px 0px #1A1611',
        'sketch-lg': '8px 8px 0px #1A1611',
        'sketch-xl': '12px 12px 0px #1A1611',
        'sketch-blue': '5px 5px 0px #2563EB',
        'sketch-green': '5px 5px 0px #16A34A',
        'sketch-red': '5px 5px 0px #DC2626',
        'sketch-purple': '5px 5px 0px #7C3AED',
        'sketch-hover': '-2px -2px 0px #1A1611',
      },
      backgroundImage: {
        'paper-lines': "repeating-linear-gradient(transparent, transparent 27px, #D4C9A8 27px, #D4C9A8 28px)",
        'paper-grid': "linear-gradient(#E8DFC4 1px, transparent 1px), linear-gradient(90deg, #E8DFC4 1px, transparent 1px)",
      },
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out',
        'ink-draw': 'inkDraw 1.2s ease-in-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'stamp': 'stamp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        stamp: {
          '0%': { transform: 'scale(1.5) rotate(-5deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
