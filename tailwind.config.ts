import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1a1a1a',
        },
        accent: {
          red: '#dc0000',
          yellow: '#ffd700',
          redGlow: '#ff0000',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.1)',
          bg: 'rgba(20, 20, 20, 0.6)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a3a3a3',
          muted: '#737373',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-russo-one)', 'Oswald', 'Impact', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
