/** @type {import('tailwindcss').Config} */
// Visual system for the Global Talent homepage, aligned with the original taknikai.com brand:
// deep navy surfaces (#07101F / #101A34 / #1A2C47), blue → violet accent (#2563EB → #7C3AED),
// Poppins for text and Montserrat for display headings. Token names are semantic so components read naturally:
//   ink      → primary text (and, at low alpha, borders / subtle fills)
//   ivory    → page background · sand/paper → alternating section background
//   card     → standard surface · elevated → raised surface · abyss → footer
//   brand    → accent scale (blue)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        ivory: '#07101F',
        paper: '#0B1628',
        sand: { DEFAULT: '#0B1628', deep: '#1A2C47' },
        card: '#0F1B30',
        elevated: '#13213A',
        abyss: '#000000',
        header: '#101A34',
        onaccent: '#FFFFFF',
        ink: { DEFAULT: '#F8FAFC', soft: '#13213A', line: '#1E2D47' },
        charcoal: '#CBD5E1',
        slate: '#94A3B8',
        mist: '#7A879A',
        accent: '#E22D4B',
        violet: '#7C3AED',
        brand: {
          50: '#0E1A33',
          100: '#13254A',
          200: '#1B3466',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#93C5FD',
          800: '#BFDBFE',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Montserrat', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Small uppercase labels: the original site sets these in Poppins rather than a monospace face
        mono: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.02em',
      },
      maxWidth: { site: '1200px' },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px -18px rgba(0,0,0,0.7)',
        lift: '0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 60px -28px rgba(0,0,0,0.85)',
        glow: '0 0 0 1px rgba(37,99,235,0.3), 0 0 24px -4px rgba(37,99,235,0.3)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
