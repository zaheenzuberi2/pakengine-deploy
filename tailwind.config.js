/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './demo.html',
    './*.html',
    './guides/*.html',
    './_build/build.mjs',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0B0D10',
          950: '#0B0D10',
          900: '#0F1216',
          800: '#14181E',
          700: '#1A1F26',
          600: '#222831',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  // Classes assembled at runtime in JS (setStatus() status pill). The scanner
  // sees them as string literals in index.html, but safelist guarantees them.
  safelist: [
    'bg-slate-400', 'bg-sky-400', 'bg-emerald-400', 'bg-amber-400',
    'animate-ping', 'opacity-75', 'opacity-0',
  ],
};
