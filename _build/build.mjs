/* PakEngine Rent Ledger — static marketing page builder
   No dependencies. Run:  node _build/build.mjs
   Emits <slug>.html into the deploy root; Vercel cleanUrls serves them at /<slug>. */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://pakengine.com';
const WA = 'https://wa.me/923461223692';
const SALES = 'sales@pakengine.com';
const SUPPORT = 'support@pakengine.com';
const UPDATED = 'September 2026';

/* ------------------------------------------------------------------ *
 *  Shared chrome
 * ------------------------------------------------------------------ */

const LOGO = (h = 8) => `
<svg class="h-${h} w-${h} text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>`;

const NAV_LINKS = [
  ['/features', 'Features'],
  ['/pricing', 'Pricing'],
  ['/faq', 'FAQ'],
  ['/demo', 'Live Demo'],
  ['/contact', 'Contact'],
];

function header(active) {
  const link = ([href, label], cls) =>
    `<a href="${href}" class="${cls} ${active === href ? 'text-white' : 'text-slate-300 hover:text-white'}">${label}</a>`;
  return `
<header id="nav" class="sticky top-0 z-30 border-b border-transparent">
  <nav class="mx-auto flex h-[60px] w-full max-w-6xl items-center justify-between px-5" style="padding-top: env(safe-area-inset-top);" aria-label="Primary">
    <a href="/" class="flex items-center gap-3 select-none">${LOGO(8)}
      <span class="text-xl font-black tracking-tight text-white">Pak<span class="text-emerald-500">Engine</span></span>
    </a>
    <div class="flex items-center gap-1 sm:gap-2">
      ${NAV_LINKS.map((l) => link(l, 'hidden rounded-lg px-3 py-2 text-[12.5px] font-semibold transition lg:inline-flex')).join('\n      ')}
      <a href="/" class="hidden items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-[0.98] sm:inline-flex">
        <i data-lucide="log-in" class="h-3.5 w-3.5"></i> Showroom Login
      </a>
      <button id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"
        class="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-white transition active:scale-95 lg:hidden">
        <i data-lucide="menu" class="h-4 w-4"></i>
      </button>
    </div>
  </nav>
  <div id="mobile-menu" class="hidden border-t border-white/[0.06] bg-charcoal-950/95 backdrop-blur-xl lg:hidden">
    <nav class="mx-auto flex w-full max-w-6xl flex-col px-5 py-2 text-[13.5px] font-semibold" aria-label="Mobile">
      ${NAV_LINKS.map(
        ([href, label]) =>
          `<a href="${href}" class="rounded-lg px-2 py-3 transition hover:bg-white/5 ${active === href ? 'text-white' : 'text-slate-300 hover:text-white'}">${label}</a>`
      ).join('\n      ')}
      <a href="/" class="mt-1 mb-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-white transition hover:bg-emerald-500 active:scale-[0.98]">
        <i data-lucide="log-in" class="h-4 w-4"></i> Showroom Login
      </a>
    </nav>
  </div>
</header>

<div class="mx-auto w-full max-w-6xl px-5">
  <a href="/" class="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-400 transition hover:text-white active:scale-95">
    <i data-lucide="arrow-left" class="h-3.5 w-3.5"></i> Back to home
  </a>
</div>`;
}

const FOOTER = `
<footer class="mt-16 border-t border-white/[0.08] bg-charcoal-950">
  <div class="mx-auto w-full max-w-6xl px-5 py-10">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="flex items-center gap-3 select-none">${LOGO(7)}
          <span class="text-lg font-black tracking-tight text-white">Pak<span class="text-emerald-500">Engine</span></span>
        </div>
        <p class="mt-3 max-w-xs text-[11.5px] leading-relaxed text-slate-500">
          Local-first operations &amp; fleet ledger software for car rental showrooms. pakengine.com
        </p>
      </div>
      <nav class="flex flex-wrap gap-x-6 gap-y-2 text-[12px]" aria-label="Footer">
        <a href="/features" class="font-medium text-slate-400 transition hover:text-white">Features</a>
        <a href="/pricing" class="font-medium text-slate-400 transition hover:text-white">Pricing</a>
        <a href="/faq" class="font-medium text-slate-400 transition hover:text-white">FAQ</a>
        <a href="/contact" class="font-medium text-slate-400 transition hover:text-white">Contact</a>
        <a href="/privacy" class="font-medium text-slate-400 transition hover:text-white">Privacy Policy</a>
        <a href="/terms" class="font-medium text-slate-400 transition hover:text-white">Terms &amp; Conditions</a>
      </nav>
    </div>
    <div class="mt-8 flex flex-col gap-1.5 border-t border-white/[0.06] pt-5 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>&copy; <span id="year">2026</span> PakEngine. All rights reserved. &middot; Built for the Pakistani automotive ecosystem.</span>
      <span>A project by <a href="https://zaheenzuberi.com" target="_blank" rel="noopener" class="font-semibold text-slate-400 transition hover:text-white">Zaheen Zuberi</a></span>
    </div>
  </div>
</footer>

<a href="${WA}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"
   class="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-6px_rgba(37,211,102,0.55)] ring-1 ring-white/10 transition hover:scale-105 active:scale-95"
   style="bottom: calc(1.25rem + env(safe-area-inset-bottom));">
  <svg viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  <span class="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-charcoal-900 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg ring-1 ring-white/10 transition group-hover:opacity-100 sm:block">Chat with us</span>
</a>

<script src="https://cdn.jsdelivr.net/npm/lucide@0.544.0/dist/umd/lucide.min.js"></script>
<script>
  (function () {
    function icons() { try { window.lucide && window.lucide.createIcons(); } catch (e) {} }
    icons();
    var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
    var nav = document.getElementById('nav');
    function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8); }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    var mm = document.getElementById('mobile-menu'), mt = document.getElementById('nav-toggle');
    if (mt && mm) {
      mt.addEventListener('click', function () {
        var open = mm.classList.contains('hidden');
        mm.classList.toggle('hidden', !open);
        mt.setAttribute('aria-expanded', open ? 'true' : 'false');
        mt.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        mt.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="h-4 w-4"></i>';
        icons();
      });
    }
  })();
</script>`;

/* ------------------------------------------------------------------ *
 *  Page template
 * ------------------------------------------------------------------ */

function page({ slug, title, description, ogTitle, ogDesc, keywords, jsonld = [], body }) {
  const url = `${SITE}/${slug}`;
  const og = `${SITE}/og-${slug}.jpg`;
  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: ogTitle || title, item: url },
      ],
    },
    ...jsonld,
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#0B0D10" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="keywords" content="${keywords}" />
<meta name="author" content="Zaheen Zuberi" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="PakEngine Rent Ledger" />
<meta property="og:title" content="${ogTitle || title}" />
<meta property="og:description" content="${ogDesc || description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${og}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${ogTitle || title}" />
<meta name="twitter:description" content="${ogDesc || description}" />
<meta name="twitter:image" content="${og}" />

<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />

<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: { extend: {
      colors: { charcoal: { DEFAULT: '#0B0D10', 950: '#0B0D10', 900: '#0F1216', 800: '#14181E', 700: '#1A1F26', 600: '#222831' } },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    } },
  };
</script>
<style>
  :root { color-scheme: dark; }
  html, body { background: #0B0D10; }
  body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; -webkit-tap-highlight-color: transparent; }
  #ambient { position: fixed; inset: 0; z-index: -1;
    background:
      radial-gradient(680px circle at 50% -12%, rgba(16,185,129,0.13), transparent 60%),
      radial-gradient(900px circle at 50% 118%, rgba(16,185,129,0.055), transparent 62%),
      linear-gradient(180deg, #0B0D10 0%, #0A0C0F 100%); }
  #nav { transition: background-color .25s ease, box-shadow .25s ease, border-color .25s ease; }
  #nav.is-scrolled {
    background-color: rgba(11,13,16,0.82);
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    border-bottom-color: rgba(255,255,255,0.09);
    box-shadow: 0 12px 34px -14px rgba(0,0,0,0.7); }
  details > summary { list-style: none; }
  details > summary::-webkit-details-marker { display: none; }
  .prose-pk p { margin-top: .85rem; line-height: 1.7; }
  .prose-pk h2 { margin-top: 2rem; }
  .prose-pk ul { margin-top: .85rem; }
  .prose-pk li { margin-top: .4rem; }
  @media (prefers-reduced-motion: reduce) { * { transition-duration: .01ms !important; } }
</style>
</head>
<body class="min-h-screen text-slate-100 antialiased">
<div id="ambient"></div>
${header('/' + slug)}
<main class="mx-auto w-full max-w-6xl px-5 pb-4">
${body}
</main>
${FOOTER}
</body>
</html>`;
}

/* small helpers for page bodies ----------------------------------- */
const H1 = (eyebrow, title, sub) => `
<section class="border-b border-white/[0.06] py-10 sm:py-14">
  <div class="max-w-3xl">
    <div class="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-400">${eyebrow}</div>
    <h1 class="mt-3 font-display text-[26px] font-bold leading-[1.15] tracking-tight text-white [text-wrap:balance] sm:text-[36px]">${title}</h1>
    ${sub ? `<p class="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-400 sm:text-[15px]">${sub}</p>` : ''}
  </div>
</section>`;

const CTA = (heading, subcopy) => `
<section class="py-12 text-center sm:py-16">
  <h2 class="font-display text-[19px] font-bold tracking-tight text-white sm:text-[24px]">${heading}</h2>
  <p class="mx-auto mt-2 max-w-md text-[13px] text-slate-400">${subcopy}</p>
  <a href="/" class="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.98]">
    Deploy Free 3-Day Trial <i data-lucide="arrow-right" class="h-4 w-4"></i>
  </a>
</section>`;

const FAQS = [
  ['Where is my showroom data stored?',
   'PakEngine uses a local-first storage architecture. Your active rentals, client details and revenue sheets stay exclusively on your device’s browser memory. No third party or server can access your business insights.'],
  ['How do I upgrade after the 3-day trial?',
   'Upon trial completion, transfer the monthly flat rate of 4,000 PKR via bank transfer using your automatically generated Showroom ID as the reference memo to unlock instant activation.'],
  ['Does PakEngine work without an internet connection?',
   'Yes. After the first load, PakEngine runs as an installed app that works fully offline. Every dispatch, return and payment is written to the device the moment you record it, so you never need signal at the gate or in the yard.'],
  ['Can I move my showroom to a new phone or computer?',
   'Open Settings and tap Export Fleet Backup to download a single file, then run Import Fleet Backup on the new device. Vehicles, rental history, damage records and settings transfer across exactly.'],
  ['Is there a limit on how many vehicles or staff I can add?',
   'No. The flat 4,000 PKR monthly licence covers an unlimited fleet, unlimited rentals and every staff device in one showroom. There are no per-vehicle or per-seat charges.'],
  ['How does the visual damage map stop return disputes?',
   'At check-out the operator taps every panel that already carries a scratch or dent on a symmetrical car diagram. That record is saved with the rental and shown again at return, so any new damage is unmistakable and the renter has already agreed to the pre-existing marks.'],
  ['Do you offer refunds if I stop using it mid-month?',
   'The licence is a flat monthly charge with no lock-in. You can stop paying at any time and your data stays on your device. Part-month periods are not pro-rated or refunded.'],
  ['Is my data backed up anywhere automatically?',
   'No automatic cloud backup exists by design, because nothing leaves your device. You control backups yourself with the one-file Export Fleet Backup, which we recommend running weekly and after any large batch of returns.'],
];

const faqList = (items) => `
<div class="divide-y divide-white/[0.06] border-y border-white/[0.06]">
  ${items
    .map(
      ([q, a]) => `<details class="group">
    <summary class="flex cursor-pointer items-center justify-between gap-4 py-4 text-[14px] font-semibold text-white">
      ${q}
      <i data-lucide="plus" class="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-45"></i>
    </summary>
    <p class="pb-4 pr-8 text-[13px] leading-relaxed text-slate-400">${a}</p>
  </details>`
    )
    .join('\n  ')}
</div>`;

const faqSchema = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/* ------------------------------------------------------------------ *
 *  Pages
 * ------------------------------------------------------------------ */

const featureBlock = (icon, title, copy, points) => `
<article class="border-b border-white/[0.06] py-10">
  <div class="flex items-center gap-3">
    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
      <i data-lucide="${icon}" class="h-5 w-5"></i>
    </span>
    <h2 class="font-display text-[18px] font-bold tracking-tight text-white sm:text-[22px]">${title}</h2>
  </div>
  <p class="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-slate-400">${copy}</p>
  <ul class="mt-4 grid gap-2.5 sm:grid-cols-2">
    ${points
      .map(
        (p) => `<li class="flex gap-2.5 text-[12.5px] leading-relaxed text-slate-300">
      <i data-lucide="check" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"></i><span>${p}</span>
    </li>`
      )
      .join('\n    ')}
  </ul>
</article>`;

const PAGES = {
  features: page({
    slug: 'features',
    title: 'Features — PakEngine Rent Ledger for Car Rental Showrooms',
    description:
      'Every PakEngine feature for Pakistani rent-a-car showrooms: visual pre-rental damage mapping, 10-second WhatsApp dispatch slips, an offline fleet ledger, an overtime calculator and one-file backup.',
    ogTitle: 'PakEngine Features',
    ogDesc: 'Visual damage mapping, WhatsApp dispatch slips, an offline fleet ledger and an overtime calculator — built for car rental showrooms.',
    keywords:
      'car rental software features, vehicle damage mapping app, rental agreement WhatsApp, offline fleet ledger, overtime calculator rent a car, rent a car software Pakistan',
    body: `
${H1(
  'Core capabilities',
  'Engineered to protect your fleet and your profits.',
  'PakEngine replaces the paper register with a single local dashboard your operators can run from any phone at the gate. Here is exactly what it does.'
)}
${featureBlock(
  'shield-check',
  'Visual asset protection',
  'A symmetrical vector diagram of the vehicle lets the operator tap every panel that already carries a scratch or dent before the keys are handed over. The record is stored with the rental and shown again at return, so pre-existing damage is never argued over.',
  [
    'Nine-panel symmetrical car map, works with one thumb',
    'Damage snapshot locked to each individual rental',
    'Same map re-shown at check-in for a side-by-side compare',
    'Renter sees and agrees to the marks at hand-over',
  ]
)}
${featureBlock(
  'file-text',
  'Instant digital agreements',
  'PakEngine builds a clean, correctly formatted dispatch slip with the vehicle, plate, rate, dates and agreed damage notes, then hands it straight to the renter on WhatsApp in under ten seconds. Returns generate a matching receipt with the final charge.',
  [
    'Pre-filled from the vehicle and rental record',
    'Routed to the renter’s WhatsApp with one tap',
    'Return receipt shows base, overtime and total',
    'Every slip is also kept in the local activity log',
  ]
)}
${featureBlock(
  'hard-drive',
  'Offline local-first ledger',
  'There is no cloud database and no account. Your entire fleet list, availability timeline, rental history and cash log live inside the browser storage on your own device. After the first load the app runs with no connection at all.',
  [
    'Installs as a PWA on Android, iPhone and desktop',
    'Works fully offline at the gate and in the yard',
    'No server can read your rentals, clients or revenue',
    'Real-time search across make and plate number',
  ]
)}
${featureBlock(
  'calculator',
  'Overtime and charge calculator',
  'Set the daily rate once per vehicle. At return PakEngine counts the days and any late hours and computes the amount due, so the counter staff never do the arithmetic by hand or lose a late fee.',
  [
    'Per-vehicle daily rate stored with the car',
    'Automatic day count and late-hour overtime',
    'On-rent value rolled up on the dashboard',
    'Due-back list surfaces overdue vehicles first',
  ]
)}
${featureBlock(
  'download',
  'One-file backup and restore',
  'Settings holds Export Fleet Backup, which downloads your whole showroom as a single file, and Import Fleet Backup, which loads it onto a new device exactly as it was. This is also how you move between a phone and a counter PC.',
  [
    'Entire showroom in one portable file',
    'Move to a new phone or PC in two taps',
    'Recommended weekly and after big return batches',
    'Nothing is uploaded anywhere in the process',
  ]
)}
${CTA('See it on your own fleet.', 'Three days of full access. No card, no install commitment, and no data leaves your device.')}
`,
  }),

  pricing: page({
    slug: 'pricing',
    title: 'Pricing — PakEngine Rent Ledger (Flat 4,000 PKR / month)',
    description:
      'One flat plan for car rental showrooms: 4,000 PKR per month for one showroom, unlimited vehicles, rentals and staff devices. 3-day free trial, no card required, pay by bank transfer.',
    ogTitle: 'PakEngine Pricing',
    ogDesc: 'Flat 4,000 PKR per month. Unlimited vehicles, rentals and staff devices. 3-day free trial, no card required.',
    keywords:
      'rent a car software price Pakistan, car rental management cost, PakEngine pricing, fleet software subscription PKR',
    jsonld: [
      {
        '@type': 'Product',
        name: 'PakEngine Rent Ledger — Showroom Licence',
        description:
          'Flat monthly licence for one car rental showroom. Unlimited vehicles, rentals and staff devices.',
        brand: { '@type': 'Brand', name: 'PakEngine' },
        offers: {
          '@type': 'Offer',
          price: '4000',
          priceCurrency: 'PKR',
          availability: 'https://schema.org/InStock',
          url: `${SITE}/pricing`,
        },
      },
    ],
    body: `
${H1(
  'Pricing',
  'One flat rate. Your whole showroom.',
  'No tiers, no per-vehicle fees, no per-seat charges. Start on a free 3-day trial and upgrade only when it is clearly paying for itself.'
)}
<section class="py-10">
  <div class="mx-auto grid max-w-3xl gap-5 sm:grid-cols-[1fr_1.1fr]">
    <div class="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div class="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Free trial</div>
      <div class="mt-3 font-display text-[30px] font-bold text-white">3 days</div>
      <p class="mt-2 text-[12.5px] leading-relaxed text-slate-400">
        Full product, every feature unlocked. The clock starts when you first open your dashboard, not when you visit this site. No card, no obligation.
      </p>
      <a href="/" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-[13.5px] font-semibold text-white transition hover:border-white/40 hover:bg-white/5">
        Start the trial <i data-lucide="arrow-right" class="h-4 w-4"></i>
      </a>
    </div>
    <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6">
      <div class="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Showroom licence</div>
      <div class="mt-3 flex items-end gap-1.5">
        <span class="font-display text-[34px] font-bold leading-none text-white">Rs.&nbsp;4,000</span>
        <span class="pb-1 text-[12.5px] text-slate-400">/ month</span>
      </div>
      <ul class="mt-4 grid gap-2.5">
        ${[
          'One showroom, unlimited vehicles',
          'Unlimited rentals and returns',
          'Every staff device included, no per-seat fee',
          'Visual damage mapping and WhatsApp slips',
          'Offline local-first ledger and overtime calculator',
          'One-file backup and restore',
        ]
          .map(
            (p) =>
              `<li class="flex gap-2.5 text-[12.5px] leading-relaxed text-slate-200"><i data-lucide="check" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"></i><span>${p}</span></li>`
          )
          .join('\n        ')}
      </ul>
      <a href="/" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-[13.5px] font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]">
        Deploy free 3-day trial <i data-lucide="arrow-right" class="h-4 w-4"></i>
      </a>
    </div>
  </div>

  <div class="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
    <h2 class="font-display text-[15px] font-bold text-white">How payment works</h2>
    <p class="mt-2 text-[12.5px] leading-relaxed text-slate-400">
      When the trial ends, the app shows your unique Showroom ID and the bank details. Transfer 4,000 PKR by bank transfer and put the Showroom ID in the reference or memo field so the payment can be matched to your account. Send the transfer screenshot on <a href="${WA}" target="_blank" rel="noopener" class="font-semibold text-emerald-400 underline underline-offset-2 hover:text-emerald-300">WhatsApp</a> and your licence key is issued for the month. Renew the same way each month. There is no auto-charge and no card stored anywhere.
    </p>
  </div>
</section>
${CTA('Try it before you pay a rupee.', 'Full access for three days. Upgrade only once it has earned its keep.')}
`,
  }),

  faq: page({
    slug: 'faq',
    title: 'FAQ — PakEngine Rent Ledger for Car Rental Showrooms',
    description:
      'Answers about PakEngine for rent-a-car showrooms: where data is stored, offline use, upgrading after the trial, moving devices, vehicle and staff limits, backups and the visual damage map.',
    ogTitle: 'PakEngine FAQ',
    ogDesc: 'Data storage, offline use, upgrading, device transfers, limits, backups and the damage map — answered.',
    keywords:
      'PakEngine FAQ, rent a car software questions, offline rental app, car rental data privacy, showroom software help',
    jsonld: [faqSchema(FAQS)],
    body: `
${H1('Support', 'Frequently asked questions', 'Everything showroom owners ask before switching off the paper register. Still unsure? <a href="/contact" class="font-semibold text-emerald-400 underline underline-offset-2 hover:text-emerald-300">Contact us</a>.')}
<section class="py-8 sm:py-10">
  <div class="max-w-3xl">
    ${faqList(FAQS)}
  </div>
</section>
${CTA('Ready when you are.', 'Start the free trial and see how it fits your counter in a day.')}
`,
  }),

  contact: page({
    slug: 'contact',
    title: 'Contact PakEngine — Sales and Support for Car Rental Showrooms',
    description:
      'Reach the PakEngine team. Sales and onboarding at sales@pakengine.com, existing-customer help at support@pakengine.com, or message us on WhatsApp for the fastest reply.',
    ogTitle: 'Contact PakEngine',
    ogDesc: 'Sales, onboarding and support for car rental showrooms — by email or WhatsApp.',
    keywords: 'contact PakEngine, rent a car software support Pakistan, PakEngine sales, showroom software help',
    jsonld: [
      {
        '@type': 'ContactPage',
        name: 'Contact PakEngine',
        url: `${SITE}/contact`,
      },
    ],
    body: `
${H1('Contact', 'Talk to the team behind PakEngine.', 'We build and support PakEngine directly. There is no call-centre layer between you and the people who write the software.')}
<section class="py-10">
  <div class="grid max-w-3xl gap-4 sm:grid-cols-3">
    <a href="${WA}" target="_blank" rel="noopener" class="flex flex-col rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5 transition hover:border-emerald-500/50">
      <span class="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300"><i data-lucide="message-circle" class="h-5 w-5"></i></span>
      <h2 class="mt-4 text-[14px] font-semibold text-white">WhatsApp</h2>
      <p class="mt-1.5 text-[12px] leading-relaxed text-slate-400">Fastest route for sales questions, upgrade payments and urgent help.</p>
      <span class="mt-3 font-mono text-[12px] font-semibold text-emerald-300">0346 1223692</span>
    </a>
    <a href="mailto:${SALES}" class="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/20">
      <span class="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-slate-300"><i data-lucide="mail" class="h-5 w-5"></i></span>
      <h2 class="mt-4 text-[14px] font-semibold text-white">Sales &amp; onboarding</h2>
      <p class="mt-1.5 text-[12px] leading-relaxed text-slate-400">New showrooms, multi-branch setups and questions before you start.</p>
      <span class="mt-3 text-[12px] font-semibold text-slate-300">${SALES}</span>
    </a>
    <a href="mailto:${SUPPORT}" class="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/20">
      <span class="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-slate-300"><i data-lucide="life-buoy" class="h-5 w-5"></i></span>
      <h2 class="mt-4 text-[14px] font-semibold text-white">Customer support</h2>
      <p class="mt-1.5 text-[12px] leading-relaxed text-slate-400">Already running PakEngine and need a hand with data, devices or backups.</p>
      <span class="mt-3 text-[12px] font-semibold text-slate-300">${SUPPORT}</span>
    </a>
  </div>
  <p class="mt-6 max-w-2xl text-[12px] leading-relaxed text-slate-500">
    We reply to WhatsApp within business hours the same day, and to email within one working day. Upgrade licence keys are issued as soon as a transfer screenshot is received and matched to a Showroom ID.
  </p>
</section>
${CTA('Or just start the trial.', 'You do not need to talk to us first. Three days of full access, no card.')}
`,
  }),

  privacy: page({
    slug: 'privacy',
    title: 'Privacy Policy — PakEngine Rent Ledger',
    description:
      'How PakEngine handles data. Your showroom records never leave your device. No trackers, no analytics, no accounts. This page explains the only data that touches a network: CDN request logs.',
    ogTitle: 'PakEngine Privacy Policy',
    ogDesc: 'Your showroom data never leaves your device. No trackers, no analytics, no accounts.',
    keywords: 'PakEngine privacy policy, local-first data, no tracking rental software, car rental data protection',
    body: `
${H1('Legal', 'Privacy Policy', 'Last updated ' + UPDATED + '.')}
<section class="prose-pk max-w-2xl py-8 text-[13px] text-slate-400">
  <h2 class="font-display text-[16px] font-bold text-white">The short version</h2>
  <p>PakEngine is a local-first application. Your fleet list, rentals, client details, damage records and revenue figures are written only to the browser storage on the device you use them on. They are never transmitted to us or to any server, and we have no ability to read them.</p>

  <h2 class="font-display text-[16px] font-bold text-white">Data you enter</h2>
  <p>Everything you type into PakEngine — showroom name, contact number, vehicles, renters, dates, notes, damage marks and amounts — stays on your device. Removing the app, clearing browser data, or using a private window will erase it. You are responsible for your own backups using Export Fleet Backup in Settings.</p>

  <h2 class="font-display text-[16px] font-bold text-white">Data that touches a network</h2>
  <ul>
    <li><strong>Static file delivery.</strong> The app, its fonts and its icon library are served over a content delivery network (Vercel, jsDelivr, Google Fonts). Those providers log ordinary web-request metadata such as your IP address, timestamp and user agent to deliver files and defend against abuse. We do not receive or store those logs.</li>
    <li><strong>Upgrade payments.</strong> When you choose to upgrade you send a bank transfer and a WhatsApp message yourself. That interaction is governed by your bank’s and WhatsApp’s own policies. We store only your Showroom ID, showroom name and the contact number you provide, to match the payment and issue a licence key.</li>
  </ul>

  <h2 class="font-display text-[16px] font-bold text-white">What we do not do</h2>
  <ul>
    <li>No analytics, pixels, session recording or advertising trackers.</li>
    <li>No account system and no cloud database.</li>
    <li>No selling, sharing or profiling of any data.</li>
  </ul>

  <h2 class="font-display text-[16px] font-bold text-white">Contact</h2>
  <p>Questions about this policy: <a href="mailto:${SUPPORT}" class="font-semibold text-emerald-400 underline underline-offset-2 hover:text-emerald-300">${SUPPORT}</a>.</p>
</section>
`,
  }),

  terms: page({
    slug: 'terms',
    title: 'Terms & Conditions — PakEngine Rent Ledger',
    description:
      'The terms for using PakEngine Rent Ledger: the 3-day trial, the flat 4,000 PKR monthly licence, payment by bank transfer, acceptable use, and the limits of liability for a local-first tool.',
    ogTitle: 'PakEngine Terms & Conditions',
    ogDesc: 'The trial, the flat monthly licence, payment, acceptable use and liability — in plain terms.',
    keywords: 'PakEngine terms and conditions, rental software licence, car rental app terms of service',
    body: `
${H1('Legal', 'Terms &amp; Conditions', 'Last updated ' + UPDATED + '.')}
<section class="prose-pk max-w-2xl py-8 text-[13px] text-slate-400">
  <h2 class="font-display text-[16px] font-bold text-white">1. The service</h2>
  <p>PakEngine Rent Ledger is a local-first web application for recording car rental showroom operations. It runs in your browser and stores your data on your device. We provide the software; we do not operate your showroom or hold your records.</p>

  <h2 class="font-display text-[16px] font-bold text-white">2. Free trial</h2>
  <p>New installs receive a 3-day free trial with every feature enabled. The trial begins when you first open your dashboard. When it ends, the app is locked until a valid monthly licence key is entered. Trial data remains on your device and is available again once you upgrade.</p>

  <h2 class="font-display text-[16px] font-bold text-white">3. Licence and payment</h2>
  <p>The licence is a flat 4,000 PKR per calendar month for one showroom, covering unlimited vehicles, rentals and staff devices. Payment is made by bank transfer with your Showroom ID as the reference. A licence key is issued for the month once the transfer is confirmed. There is no auto-renewal; you repeat the transfer each month to continue. Part-month use is not pro-rated or refunded.</p>

  <h2 class="font-display text-[16px] font-bold text-white">4. Your responsibilities</h2>
  <ul>
    <li>Keep your own backups with Export Fleet Backup. We cannot recover data from your device.</li>
    <li>Use the software lawfully and keep accurate records for your own business and tax obligations.</li>
    <li>Do not resell, sublicense or redistribute the software or licence keys.</li>
  </ul>

  <h2 class="font-display text-[16px] font-bold text-white">5. Availability and changes</h2>
  <p>The app is delivered as static files over third-party infrastructure. We aim for continuous availability but do not guarantee it. Features may be added, changed or removed between versions. Material changes to these terms will be reflected by the date above.</p>

  <h2 class="font-display text-[16px] font-bold text-white">6. Limitation of liability</h2>
  <p>PakEngine is provided on an "as is" basis. To the maximum extent permitted by law, we are not liable for lost profits, lost data, business interruption or any indirect or consequential loss arising from use of, or inability to use, the software. Because your data lives only on your device, protecting it with regular backups is essential and remains your responsibility. Our total liability in any matter is limited to the licence fees you paid in the month the claim arose.</p>

  <h2 class="font-display text-[16px] font-bold text-white">7. Contact</h2>
  <p>Questions about these terms: <a href="mailto:${SUPPORT}" class="font-semibold text-emerald-400 underline underline-offset-2 hover:text-emerald-300">${SUPPORT}</a>.</p>
</section>
`,
  }),
};

/* ------------------------------------------------------------------ *
 *  Emit
 * ------------------------------------------------------------------ */

const slugs = Object.keys(PAGES);
for (const slug of slugs) {
  const out = resolve(ROOT, `${slug}.html`);
  writeFileSync(out, PAGES[slug], 'utf8');
  console.log('wrote', `${slug}.html`, `(${PAGES[slug].length} bytes)`);
}

/* sitemap ---------------------------------------------------------- */
const sm = [
  ['/', 'weekly', '1.0'],
  ['/features', 'monthly', '0.8'],
  ['/pricing', 'monthly', '0.8'],
  ['/faq', 'monthly', '0.7'],
  ['/demo', 'monthly', '0.7'],
  ['/contact', 'yearly', '0.5'],
  ['/privacy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sm
  .map(
    ([loc, cf, pr]) =>
      `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(resolve(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('wrote sitemap.xml', `(${sm.length} urls)`);
