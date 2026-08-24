import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ground: 'var(--ground)',
        card: 'var(--card)',
        'card-2': 'var(--card-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        brand: 'var(--brand)',
        'brand-soft': 'var(--brand-soft)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
        lock: 'var(--lock)',
        'lock-soft': 'var(--lock-soft)',
        ok: 'var(--ok)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Bricolage Grotesque', 'Mukta', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Mukta', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        button: '10px',
        input: '10px',
        card: '14px',
        dialog: '18px',
        pill: '999px',
        sm: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        full: '999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
    },
  },
  plugins: [],
};

export default config;
