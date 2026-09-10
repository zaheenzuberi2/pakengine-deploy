/* PakEngine Rent Ledger — static marketing page builder
   Run:  node _build/build.mjs   (also compiles Tailwind -> /styles.css)
   Emits <slug>.html into the deploy root; Vercel cleanUrls serves them at /<slug>. */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://pakengine.com';
const WA = 'https://wa.me/923461223692';
const SALES = 'sales@pakengine.com';
const SUPPORT = 'support@pakengine.com';
const UPDATED = 'September 2026';

/* Escape text for use in HTML text nodes and double-quoted attributes. */
const h = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

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
  ['/guides', 'Guides'],
  ['/faq', 'FAQ'],
  ['/demo', 'Live Demo'],
  ['/contact', 'Contact'],
];

function header(active, back = { href: '/', label: 'Back to home' }) {
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
  <a href="${back.href}" class="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-400 transition hover:text-white active:scale-95">
    <i data-lucide="arrow-left" class="h-3.5 w-3.5"></i> ${back.label}
  </a>
</div>`;
}

const FOOTER = () => `
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
      <div class="flex flex-col gap-6 sm:flex-row sm:gap-12">
        <nav class="flex flex-col gap-2 text-[12px]" aria-label="Product">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Product</span>
          <a href="/features" class="font-medium text-slate-400 transition hover:text-white">Features</a>
          <a href="/pricing" class="font-medium text-slate-400 transition hover:text-white">Pricing</a>
          <a href="/guides" class="font-medium text-slate-400 transition hover:text-white">Guides</a>
          <a href="/faq" class="font-medium text-slate-400 transition hover:text-white">FAQ</a>
          <a href="/demo" class="font-medium text-slate-400 transition hover:text-white">Live demo</a>
        </nav>
        <nav class="flex flex-col gap-2 text-[12px]" aria-label="Coverage">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Coverage</span>
          <span class="grid grid-cols-2 gap-x-6 gap-y-2">
            ${CITIES.map((c) => `<a href="/${c.slug}" class="font-medium text-slate-400 transition hover:text-white">${c.name}</a>`).join('\n            ')}
          </span>
        </nav>
        <nav class="flex flex-col gap-2 text-[12px]" aria-label="Company">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Company</span>
          <a href="/contact" class="font-medium text-slate-400 transition hover:text-white">Contact</a>
          <a href="/privacy" class="font-medium text-slate-400 transition hover:text-white">Privacy Policy</a>
          <a href="/terms" class="font-medium text-slate-400 transition hover:text-white">Terms &amp; Conditions</a>
        </nav>
      </div>
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

function page({ slug, title, description, ogTitle, ogDesc, keywords, jsonld = [], body, noindex = false, ogImage, back, crumbs }) {
  const url = `${SITE}/${slug}`;
  /* Per-page OG art when the file is actually on disk, otherwise the house image.
     Lets a new page ship before its og-<slug>.jpg exists without emitting a 404. */
  const hasOwnOg = !noindex && existsSync(resolve(ROOT, `og-${slug}.jpg`));
  const og = ogImage || (hasOwnOg ? `${SITE}/og-${slug}.jpg` : `${SITE}/og.jpg`);
  const ogT = ogTitle || title;
  const ogD = ogDesc || description;
  const trail = crumbs || [['Home', SITE + '/'], [ogT, url]];
  const graph = noindex
    ? [...jsonld]
    : [
        {
          '@type': 'BreadcrumbList',
          itemListElement: trail.map(([name, item], i) => ({
            '@type': 'ListItem', position: i + 1, name, item,
          })),
        },
        ...jsonld,
      ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#0B0D10" />
<title>${h(title)}</title>
<meta name="description" content="${h(description)}" />
<meta name="keywords" content="${h(keywords)}" />
<meta name="author" content="Zaheen Zuberi" />
${noindex ? '' : `<link rel="canonical" href="${url}" />`}
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="apple-mobile-web-app-title" content="PakEngine" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="PakEngine Rent Ledger" />
<meta property="og:title" content="${h(ogT)}" />
<meta property="og:description" content="${h(ogD)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${og}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${h(ogT)}" />
<meta name="twitter:description" content="${h(ogD)}" />
<meta name="twitter:image" content="${og}" />

${graph.length ? `<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
</script>` : ''}

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />

<link rel="stylesheet" href="/styles.css" />
<script defer src="/_vercel/insights/script.js"></script>
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
  .skip-link { position: absolute; left: -9999px; top: 0; z-index: 100; }
  .skip-link:focus { left: 1rem; top: 1rem; padding: .5rem .9rem; border-radius: .5rem; background: #10b981; color: #05261c; font-weight: 700; font-size: 13px; }
  :focus-visible { outline: 2px solid #34d399; outline-offset: 2px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) { * { transition-duration: .01ms !important; } }
</style>
</head>
<body class="min-h-screen text-slate-100 antialiased">
<a href="#main" class="skip-link">Skip to content</a>
<div id="ambient"></div>
${header('/' + slug, back)}
<main id="main" class="mx-auto w-full max-w-6xl px-5 pb-4">
${body}
</main>
${FOOTER()}
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
   'Upon trial completion, transfer 4,000 PKR for one month or 40,000 PKR for a full year (two months free) via bank transfer, using your automatically generated Showroom ID as the reference memo to unlock instant activation.'],
  ['Is there an annual plan?',
   'Yes. A full year is 40,000 PKR, which is two months free versus paying monthly. You pay once by bank transfer and get a single key that stays active for twelve months, so there is no monthly renewal to remember. The monthly option at 4,000 PKR stays available if you prefer it.'],
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

/* ------------------------------------------------------------------ *
 *  City landing pages
 * ------------------------------------------------------------------ */

const CITIES = [
  {
    slug: 'islamabad',
    name: 'Islamabad',
    lead:
      'Showrooms across Blue Area and the F-sectors run heavy corporate accounts and airport transfers, often handing the same vehicle to a different renter within hours. PakEngine keeps the availability board, the pre-rental damage record and the day’s cash straight without a single paper slip.',
    reasons: [
      'Airport-run turnarounds logged in seconds so a car is never double-booked',
      'One WhatsApp dispatch slip per corporate booking, formatted the same every time',
      'Twin-city operators can run one showroom licence across staff phones in Islamabad and Rawalpindi',
    ],
    faqs: [
      ['Does PakEngine need internet at the Islamabad airport pickup point?',
       'No. After the first load it runs as an installed app that works fully offline, so the operator can record the check-out and hand over the WhatsApp slip even with no signal in the arrivals area.'],
      ['Can two branches in Islamabad and Rawalpindi share one account?',
       'The flat 4,000 PKR licence covers one showroom and every staff device in it. If the two branches operate as one business with a shared fleet, one licence and a shared backup file keeps them in sync; genuinely separate fleets need a licence each.'],
    ],
  },
  {
    slug: 'lahore',
    name: 'Lahore',
    lead:
      'Lahore runs the largest private rental fleets in Punjab, and wedding season turns a steady operation into a queue at the counter. PakEngine lets the counter staff check a car out, compute the overtime and message the renter the agreement in under a minute, so the queue keeps moving.',
    reasons: [
      'Peak-season check-outs done in under a minute, damage map included',
      'Overtime and extra-day charges calculated automatically at return',
      'Every dispatch and return kept in a local activity log for the day’s reconciliation',
    ],
    faqs: [
      ['How does PakEngine handle wedding-season overtime charges?',
       'Set the daily rate once per vehicle. At return PakEngine counts the days and any late hours and shows the amount due, so counter staff never work it out by hand or lose a late fee during a rush.'],
      ['Is my Lahore showroom’s client list stored on a server?',
       'No. Client names, numbers, CNICs and rental history stay in the browser storage on your own device. Nothing is uploaded, so no third party can see your booking volumes or customer list.'],
    ],
  },
  {
    slug: 'karachi',
    name: 'Karachi',
    lead:
      'Karachi showrooms mix short city hires with long interior-Sindh trips and standing corporate contracts, and a returned vehicle is where the arguments start. PakEngine records the exact condition of every panel at check-out and shows the same diagram again at return, so pre-existing damage is never disputed.',
    reasons: [
      'Symmetrical damage map locked to each rental, re-shown at check-in',
      'Long-trip and corporate contracts tracked with a clear due-back list',
      'One-file backup so a lost or stolen counter phone never means a lost ledger',
    ],
    faqs: [
      ['A renter says the scratch was already there. How does PakEngine settle it?',
       'At check-out the operator taps every panel that already carries a scratch or dent, the renter sees and agrees to it, and that record is saved with the rental. At return the same diagram is shown, so any new damage is unmistakable.'],
      ['What happens to my Karachi showroom data if a staff phone is lost?',
       'Run Export Fleet Backup regularly (weekly, and after big return batches). If a device is lost, install PakEngine on a new phone and run Import Fleet Backup to restore the fleet, history and damage records exactly.'],
    ],
  },
  {
    slug: 'rawalpindi',
    name: 'Rawalpindi',
    lead:
      'Pindi showrooms work two markets at once: airport runs shared with Islamabad, and the summer flow of families and 4x4 parties heading for Murree, the Galiyat and the north. PakEngine keeps the availability board honest when the same vehicle is wanted by a tourist party and a corporate client on one weekend.',
    reasons: [
      'Peak summer demand tracked so a vehicle is never promised to two parties',
      'Multi-day northern hires carry the advance paid and the balance still due',
      'Every check-out and return written to a local log the next shift can read',
    ],
    faqs: [
      ['We add cars for the Murree season and sell them afterwards. Does that work?',
       'Yes. Vehicles are added when they arrive and removed from the fleet when they go, so the availability board only ever shows what you actually hold. The activity log keeps the recent dispatches and returns, and a backup taken at the end of the season preserves the state you closed on.'],
      ['Our counter is manned by different people on different shifts. Will they see the same fleet?',
       'PakEngine stores everything on the device it runs on, so the simplest arrangement is one shared counter phone or tablet that every shift uses. If you would rather each person had their own device, hand the state over with the one-file backup at the change of shift.'],
    ],
  },
  {
    slug: 'faisalabad',
    name: 'Faisalabad',
    lead:
      'Faisalabad rental demand runs on the mills. Textile and export houses keep cars on standing monthly arrangements, and visiting buyers need a clean vehicle and a clear record for the run to Lahore or Islamabad airport. PakEngine holds the long contracts and the one-off transfers in the same ledger.',
    reasons: [
      'Long corporate hires kept on the due-back list beside the day rentals',
      'Airport transfer runs logged against the rate agreed with the company',
      'A dispatch slip formatted the same every time, so a client can file it',
    ],
    faqs: [
      ['Can PakEngine handle a car left with a mill for a whole month?',
       'Yes. Set the rate and the return date at check-out and the vehicle stays marked as out for the full period, so nobody promises it to a walk-in. At return PakEngine counts the days and any late hours and shows the amount due.'],
      ['Our corporate clients want something on record. What do they get?',
       'Every check-out produces a dispatch slip with the vehicle, plate, rate, dates, advance, balance and the damage marks the renter agreed to. It goes to the client on WhatsApp and stays in your local log, so the same record sits on both sides.'],
    ],
  },
  {
    slug: 'multan',
    name: 'Multan',
    lead:
      'Multan is the turning point for south Punjab, and much of its rental work is long: Dera Ghazi Khan, Bahawalpur, Sukkur and back, often several days with the tank agreed up front. PakEngine records the fuel level and the advance when the car leaves, so a long trip settles without an argument.',
    reasons: [
      'Fuel level at check-out recorded and shown again on the return screen',
      'Multi-day intercity hires carry the advance received and the balance due',
      'Condition mapped panel by panel before a car leaves for a long run',
    ],
    faqs: [
      ['A car went out full and came back nearly empty. Does PakEngine track that?',
       'Yes. At check-out the operator picks the level from Empty, a quarter, a half, three quarters or Full. It is stored with the rental, printed on the dispatch slip and shown again on the return screen, so the difference sits on a record you both agreed to.'],
      ['Does the renter get the agreement before the car leaves Multan?',
       'The dispatch slip goes to the renter’s WhatsApp at hand-over, so they carry the vehicle, plate, rate, dates and the agreed damage marks with them for the whole trip. Nothing depends on a paper slip surviving several days on the road.'],
    ],
  },
  {
    slug: 'sialkot',
    name: 'Sialkot',
    lead:
      'Sialkot rents to a different customer. Overseas buyers fly into the international airport for the sports goods and surgical trade, and expatriate families come home for a few weeks. Both expect a written agreement they can read, and PakEngine produces one in plain English at the counter.',
    reasons: [
      'A clear English dispatch slip an overseas client can actually read',
      'Airport arrivals recorded offline, with the copy sent when signal returns',
      'Every hire kept in the local log, so a returning visitor is easy to check',
    ],
    faqs: [
      ['Many of our clients are foreign nationals. Does the agreement suit them?',
       'The dispatch slip is written in plain English with the vehicle, plate, rate, dates, charges and the damage marks the renter agreed to, and it goes straight to their phone on WhatsApp. Nothing in it assumes a local renter.'],
      ['Can we record the hand-over at the airport before we have signal?',
       'Yes. PakEngine writes the check-out, the damage map and the charges to the device with no connection at all. The WhatsApp copy sends whenever signal returns, and the record is saved either way.'],
    ],
  },
  {
    slug: 'gujranwala',
    name: 'Gujranwala',
    lead:
      'Gujranwala rental books fill with events. One wedding takes several cars and often a coaster, booked weeks ahead and returned the same night, and the money held against each vehicle has to be tracked. PakEngine keeps every car in the booking on one availability board instead of a page in a diary.',
    reasons: [
      'Several vehicles for one event, each with its own record and damage map',
      'Money taken at check-out subtracted so the balance shows at return',
      'Same-night returns logged at the gate without waiting for the office',
    ],
    faqs: [
      ['A wedding takes four cars at once. Does each need its own entry?',
       'Yes, and that is deliberate. Each vehicle gets its own check-out, its own damage record and its own return, so if one comes back with a dent you know exactly which car and which renter, instead of settling it against the booking as a whole.'],
      ['We hold a deposit on every event car. Where does that go?',
       'Enter it in the advance received field at check-out. PakEngine subtracts it from the total and carries the balance on the dispatch slip and again at return, so the amount to collect or hand back is on the record rather than in someone’s head.'],
    ],
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    lead:
      'Hyderabad works the corridor into interior Sindh and the daily run down to Karachi. Cars go out for Mirpurkhas, Sukkur and Larkana and come back dusty after long hours on rough road, which is precisely when a pre-rental condition record earns its keep.',
    reasons: [
      'Condition mapped panel by panel before a car leaves for interior routes',
      'Long Karachi-corridor hires tracked with a clear due-back date',
      'Runs on an ordinary Android phone at the counter, with no computer needed',
    ],
    faqs: [
      ['A car comes back dusty and we cannot tell old damage from new. What helps?',
       'The check-out map. Every panel that already carried a scratch or dent was tapped and agreed before the keys left, and the same diagram is shown at return, so once the car is washed you are comparing against a record you both accepted rather than against memory.'],
      ['Do we need a computer to run this at the counter?',
       'No. PakEngine installs as an app on an ordinary Android phone and runs from there, including offline. Most showrooms work entirely from the counter phone and keep a copy elsewhere with the backup file.'],
    ],
  },
  {
    slug: 'peshawar',
    name: 'Peshawar',
    lead:
      'Peshawar is the staging point for trips into KP and the northern valleys, where 4x4 hires go out for days at a time and come back dusty. PakEngine gives the showroom a clean digital record of who took which vehicle, for how long, with how much advance paid and how much still due on return.',
    reasons: [
      'Multi-day mountain hires tracked with advance paid and balance due on return',
      'Pre-rental condition recorded before a vehicle leaves for rough routes',
      'Works fully offline, so returns can be logged the moment a vehicle reaches the yard',
    ],
    faqs: [
      ['Can PakEngine record a part-payment when a 4x4 leaves for several days?',
       'Yes. Enter the advance received at check-out and PakEngine shows the balance due on return on the dispatch slip and again on the return screen, so nothing is forgotten after a long trip.'],
      ['Does it work without signal on northern routes?',
       'The renter’s copy is sent over WhatsApp, which needs signal, but every check-out, return and payment is written to the device offline. You record on the spot and the WhatsApp slip goes out whenever a connection is available.'],
    ],
  },
];

function cityPage(c) {
  const kw = `rent a car software ${c.name}, rent a car management software ${c.name}, car rental software ${c.name}, fleet ledger ${c.name}, vehicle damage record app ${c.name}, rent a car software Pakistan`;
  return page({
    slug: c.slug,
    title: `Rent A Car Software in ${c.name} — PakEngine`,
    description: `Rent a car software for showrooms in ${c.name}. PakEngine is a local-first fleet ledger for car rental businesses: visual pre-rental damage records, 10-second WhatsApp dispatch slips, an offline rental log and an overtime calculator. Flat 4,000 PKR/month, 3-day free trial.`,
    ogTitle: `PakEngine for ${c.name}`,
    ogDesc: `Fleet ledger, damage mapping and WhatsApp dispatch slips for rent a car showrooms in ${c.name}.`,
    keywords: kw,
    jsonld: [
      {
        '@type': 'Service',
        serviceType: 'Rent a car management software',
        name: `PakEngine Rent Ledger — ${c.name}`,
        provider: { '@type': 'Organization', name: 'PakEngine', url: SITE + '/' },
        areaServed: { '@type': 'City', name: c.name, containedInPlace: { '@type': 'Country', name: 'Pakistan' } },
        offers: { '@type': 'Offer', price: '4000', priceCurrency: 'PKR' },
        url: `${SITE}/${c.slug}`,
      },
      faqSchema([...c.faqs, FAQS[0], FAQS[3]]),
    ],
    body: `
${H1(
  `Rent a car software for ${c.name}`,
  `Run your ${c.name} rent a car showroom from one local dashboard.`,
  c.lead
)}
<section class="border-b border-white/[0.06] py-10">
  <h2 class="font-display text-[18px] font-bold tracking-tight text-white sm:text-[22px]">Why rent a car showrooms in ${c.name} use PakEngine</h2>
  <ul class="mt-5 grid gap-3 sm:grid-cols-3">
    ${c.reasons
      .map(
        (r) => `<li class="flex gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-[12.5px] leading-relaxed text-slate-300">
      <i data-lucide="check" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"></i><span>${r}</span>
    </li>`
      )
      .join('\n    ')}
  </ul>
</section>
${featureBlock(
  'shield-check',
  'Visual asset protection',
  'A symmetrical vector diagram of the vehicle lets the operator tap every panel that already carries a scratch or dent before the keys are handed over. The record is stored with the rental and shown again at return.',
  ['Nine-panel map, one-thumb operation', 'Damage snapshot locked to each rental', 'Same map re-shown at check-in', 'Renter agrees to the marks at hand-over']
)}
${featureBlock(
  'file-text',
  'Instant digital agreements',
  'PakEngine builds a clean dispatch slip with the vehicle, plate, rate, dates, advance, balance and agreed damage notes, then hands it to the renter on WhatsApp in under ten seconds.',
  ['Pre-filled from the vehicle record', 'Sent to the renter’s WhatsApp in one tap', 'Return receipt shows base, overtime and total', 'Every slip kept in the local log']
)}
${featureBlock(
  'hard-drive',
  'Offline local-first ledger',
  'No cloud database, no account. Your entire fleet list, availability timeline, rental history and cash log live in the browser storage on your own device, and the app runs with no connection after the first load.',
  ['Installs as an app on Android, iPhone and desktop', 'Works fully offline at the counter and the gate', 'No server can read your rentals or revenue', 'One-file backup and restore between devices']
)}
<section class="py-8 sm:py-10">
  <h2 class="text-center font-display text-[20px] font-bold tracking-tight text-white sm:text-[26px]">${c.name} showroom questions</h2>
  <div class="mx-auto mt-6 max-w-3xl">
    ${faqList([...c.faqs, FAQS[0], FAQS[3]])}
  </div>
</section>
${CTA(`Start your ${c.name} showroom on PakEngine.`, 'Three days of full access. No card, no install commitment, and no data leaves your device.')}
`,
  });
}

/* ------------------------------------------------------------------ *
 *  Guides
 * ------------------------------------------------------------------ */

const PUBLISHED = '2026-09-06';
const UPDATED_ISO = '2026-09-06';

const GUIDES = [
  {
    slug: 'stop-rental-damage-disputes',
    title: 'How to stop damage disputes when a rental car comes back',
    dek: 'The argument at return is almost always about who caused a mark that was already there. Here is the routine that ends it.',
    description:
      'A step-by-step routine for car rental showrooms to record pre-existing vehicle damage at check-out so returned-car disputes cannot happen: a signed condition record, a panel diagram, and a matching check at return.',
    keywords: 'rent a car damage dispute, pre-rental damage record, vehicle condition report, car rental check-out process',
    readMin: 5,
    related: [['/features', 'The visual damage map, in detail'], ['/guides/pre-rental-inspection-checklist', 'The pre-rental inspection checklist']],
    body: `
<p>Almost every dispute at return follows the same shape. The renter says the scratch on the rear door was there when they took the car. The operator is fairly sure it was not, but has nothing written down. Neither side can prove it, so the showroom either eats the repair or loses a customer.</p>
<p>The fix is not a better argument at return. It is a record made <em>before</em> the keys change hands, that both people looked at and agreed to.</p>

<h2>1. Walk the car with the renter, not alone</h2>
<p>Do the check-out inspection standing next to the renter. This is the single most important step. When the renter has personally pointed at the existing marks, there is no dispute to have later. Doing it alone and handing them a form to sign changes nothing.</p>

<h2>2. Record every existing mark against a fixed diagram</h2>
<p>Use the same outline of a car every time: bonnet, roof, boot, both bumpers, all four doors, both wings. For each panel, note whether it already carries a scratch, a dent or a crack. A picture beats a paragraph, because at return you are comparing two pictures, not reading two descriptions.</p>
<ul>
  <li>Mark existing damage, not general wear. Kerbed alloys and stone chips on the bonnet are normal; note the ones that matter.</li>
  <li>Photograph anything significant, with the number plate in frame so the photo is tied to that vehicle and that day.</li>
  <li>Check the spare, the jack and the tools, and write down the fuel level.</li>
</ul>

<h2>3. Attach the record to that specific rental</h2>
<p>The condition record is worth nothing if you cannot find it in three weeks. It has to be filed against the rental, with the renter's name, the dates and the vehicle, so that when the car comes back you pull up <em>that</em> record, not last month's.</p>

<h2>4. Repeat the same walk at return</h2>
<p>At check-in, walk the car again, against the same diagram, with the renter present. Any panel that was clean at check-out and is marked now is new damage, and it is obvious to both of you. Because the renter agreed to the original marks, the only thing to discuss is the new one.</p>

<h2>What this looks like without paper</h2>
<p>PakEngine runs this exact routine on a phone. At check-out the operator taps each panel that already has a mark on a symmetrical car diagram; the renter sees it and agrees; the record is saved with the rental. At return the same diagram comes back up, pre-marked, and the operator taps anything new. The comparison is done for you.</p>`,
  },

  {
    slug: 'paper-register-vs-digital',
    title: 'Paper register vs digital ledger for a rent-a-car showroom',
    dek: 'A paper register is cheap and familiar. It also quietly costs a showroom money every month. Here is where.',
    description:
      'A practical comparison of the paper rental register and a digital rental ledger for Pakistani car rental showrooms: what each costs in disputes, lost overtime, availability mistakes and reconciliation time.',
    keywords: 'rent a car register, car rental record keeping, rental ledger software, digital vs paper rental log',
    readMin: 6,
    related: [['/pricing', 'What PakEngine costs'], ['/guides/calculate-rental-overtime', 'Calculating overtime and late fees']],
    body: `
<p>The paper register works. Showrooms have run on it for decades. But "it works" hides a set of small, recurring losses that add up to real money over a year. It is worth seeing them clearly before deciding they do not matter.</p>

<h2>Disputes you cannot win</h2>
<p>A handwritten line that says "minor scratches" does not settle an argument about a specific scratch on a specific panel. Without a condition record both people agreed to, the showroom loses the disputed repairs, one at a time, all year.</p>

<h2>Overtime that never gets charged</h2>
<p>When a car comes back four hours late during a busy afternoon, the staff member at the counter is doing three things at once. Working out "two days plus four hours at what rate" by hand is the task that gets skipped. Each skipped late fee is a few thousand rupees that was owed and never collected.</p>

<h2>Double bookings and idle cars</h2>
<p>A register is a list of past events, not a picture of what is available right now. Knowing whether the white Corolla is free on Thursday means flipping back through pages. Sometimes the answer is wrong, and a car is promised twice; sometimes a free car sits in the yard because nobody was sure.</p>

<h2>The nightly reconciliation</h2>
<p>Adding up the day's cash from a register means reading every line for that day. A digital log shows the day's dispatches, returns and amounts in one view, already totalled.</p>

<h2>What a digital ledger actually changes</h2>
<ul>
  <li><strong>Condition on record.</strong> A panel-by-panel damage map saved with each rental, shown again at return.</li>
  <li><strong>Charges computed.</strong> Set the daily rate once; the days and late hours are counted for you.</li>
  <li><strong>Availability at a glance.</strong> Every vehicle shows as available or out, with the due-back date.</li>
  <li><strong>Backups.</strong> A register that is lost or burnt is gone. A one-file export restores the whole showroom onto a new device.</li>
</ul>

<h2>The honest downsides</h2>
<p>A digital tool needs a charged phone and a few days of the staff getting used to it. If it depends on a live internet connection or a monthly-growing subscription per car, it can cost more hassle than it saves. That is why PakEngine is local-first, works offline after the first load, and is a flat monthly fee for the whole showroom rather than per vehicle.</p>`,
  },

  {
    slug: 'calculate-rental-overtime',
    title: 'How to calculate car rental overtime and late fees',
    dek: 'A simple, consistent method for charging extra hours and extra days, so staff apply it the same way every time.',
    description:
      'How car rental showrooms should calculate overtime, late-return fees and extra-day charges: a clear grace-period and hourly-rate method, worked examples, and how to communicate it to renters up front.',
    keywords: 'car rental overtime charges, rent a car late fee, rental extra day charge, how to calculate rental hours',
    readMin: 5,
    related: [['/features', 'The overtime calculator'], ['/guides/rent-a-car-agreement-template', 'The rent-a-car agreement template']],
    body: `
<p>Overtime charges cause friction for one reason: the renter did not know the rule before they were late. Fix that by deciding the rule, writing it on the agreement, and applying it the same way every time.</p>

<h2>Set three numbers, once</h2>
<ul>
  <li><strong>The daily rate</strong> per vehicle. You already have this.</li>
  <li><strong>The grace period</strong> — how late is "still on time". One hour is common and fair.</li>
  <li><strong>The hourly overtime rate</strong> — usually the daily rate divided by a number between 6 and 10. Dividing by 8 is a clean choice: an eight-hour overrun costs a full extra day, which is the right incentive.</li>
</ul>

<h2>The method</h2>
<p>At return, work out the total time the car was out, in whole days plus leftover hours.</p>
<ol>
  <li>Charge the agreed daily rate for each full 24-hour day.</li>
  <li>If the leftover time is within the grace period, charge nothing extra.</li>
  <li>Otherwise, charge the hourly overtime rate for each leftover hour (round up part-hours).</li>
  <li>If leftover hours reach a full day's worth, charge a full day instead — never more than a day for a day.</li>
</ol>

<h2>Worked example</h2>
<p>Daily rate Rs 8,000. Grace period 1 hour. Hourly rate Rs 8,000 ÷ 8 = Rs 1,000. The car goes out Monday 9:00 a.m. and comes back Wednesday 2:30 p.m.</p>
<ul>
  <li>Monday 9:00 to Wednesday 9:00 is 2 full days = Rs 16,000.</li>
  <li>Leftover time is 5.5 hours. Past the 1-hour grace, so 5 hours (rounding 5.5 up to 6, then capping at the sensible whole) — charge 6 × Rs 1,000 = Rs 6,000.</li>
  <li>Total: Rs 22,000.</li>
</ul>
<p>Six hours of overtime is close to a full day; some showrooms would simply charge the third full day (Rs 24,000). Either is defensible — pick one and stay consistent.</p>

<h2>Tell the renter first</h2>
<p>Put the daily rate, the grace period and the hourly overtime rate on the dispatch slip the renter receives at check-out. When the rule was in their hand before they were late, the charge at return is arithmetic, not an argument. PakEngine does this calculation automatically at return and prints the breakdown on the receipt.</p>`,
  },

  {
    slug: 'pre-rental-inspection-checklist',
    title: 'The pre-rental vehicle inspection checklist',
    dek: 'A short, repeatable check to run before every car leaves the yard. Copy it, print it, or work through it on a phone.',
    description:
      'A complete pre-rental vehicle inspection checklist for car rental showrooms: exterior panels, tyres, lights, interior, documents, fuel and the condition record the renter should sign.',
    keywords: 'car rental inspection checklist, pre-rental vehicle check, rent a car handover checklist, vehicle condition report',
    readMin: 4,
    related: [['/guides/stop-rental-damage-disputes', 'How to stop damage disputes'], ['/features', 'The visual damage map']],
    body: `
<p>Run the same check before every rental. It takes three or four minutes with the renter standing next to you, and it is the record that protects the showroom if the car comes back damaged.</p>

<h2>Exterior</h2>
<ul>
  <li>Walk the full body: bonnet, roof, boot lid, both bumpers, all four doors, both front wings, both rear quarters.</li>
  <li>Mark every existing scratch, dent, crack or repaint on a car diagram.</li>
  <li>Windscreen and windows: chips or cracks.</li>
  <li>Lights and indicators front and rear: all working, none cracked.</li>
  <li>Mirrors: intact, both fold and adjust.</li>
  <li>Wheels: kerb damage on the alloys, and hub caps present.</li>
</ul>

<h2>Tyres</h2>
<ul>
  <li>Tread on all four, and visible condition of the spare.</li>
  <li>Pressure looks correct; no bulges or cuts on the sidewalls.</li>
  <li>Jack, wheel brace and wheel-lock key present.</li>
</ul>

<h2>Interior</h2>
<ul>
  <li>Seats and mats: existing tears, burns or heavy stains.</li>
  <li>Dashboard warning lights: none on after start-up.</li>
  <li>Air conditioning blows cold.</li>
  <li>Infotainment, wipers, horn, all windows: working.</li>
  <li>Odometer reading, written down.</li>
</ul>

<h2>Documents and fuel</h2>
<ul>
  <li>Registration book or a copy, and a valid token, in the car.</li>
  <li>Fuel level, noted. Agree the return level (return-as-received is simplest).</li>
  <li>Renter's CNIC and licence seen and recorded.</li>
</ul>

<h2>Close the check</h2>
<p>The renter looks at the completed condition record and agrees to it, in person. Keep it filed against this rental so you can pull it up at return. PakEngine turns this list into a two-minute tap-through on a phone and stores the result with the booking.</p>`,
  },

  {
    slug: 'rent-a-car-agreement-template',
    title: 'How to write a rent-a-car agreement (with a template)',
    dek: 'The clauses a showroom rental agreement should contain, and a plain template you can adapt.',
    description:
      'What to put in a car rental agreement for a Pakistani showroom: parties, vehicle, period, charges, deposit, fuel, mileage, damage, insurance, and a plain-language template to adapt.',
    keywords: 'rent a car agreement format, car rental agreement Pakistan, vehicle rental contract template, showroom rental agreement',
    readMin: 6,
    related: [['/guides/calculate-rental-overtime', 'Calculating overtime and late fees'], ['/guides/showroom-record-keeping', 'What records to keep']],
    body: `
<p>A rental agreement does two jobs: it sets out what both sides agreed, and it gives the showroom something to point to if things go wrong. It does not need to be long. It needs to be clear and consistent.</p>
<p>This is general information, not legal advice. Have a lawyer review your final wording, especially the liability and insurance clauses.</p>

<h2>What every rental agreement should cover</h2>
<ul>
  <li><strong>Parties.</strong> Showroom name and contact; renter's full name, CNIC number, licence number, address and phone.</li>
  <li><strong>Vehicle.</strong> Make, model, year, registration number, colour, odometer at check-out, fuel level at check-out.</li>
  <li><strong>Period.</strong> Date and time out, date and time due back.</li>
  <li><strong>Charges.</strong> Daily rate, number of days, total; the grace period and the hourly overtime rate; any delivery or driver charges.</li>
  <li><strong>Security deposit.</strong> Amount, form (cash or held CNIC), and exactly what it can be deducted for.</li>
  <li><strong>Fuel.</strong> Return-as-received, or full-to-full, stated plainly.</li>
  <li><strong>Mileage.</strong> Unlimited, or a daily allowance with a per-kilometre charge over it.</li>
  <li><strong>Condition.</strong> A reference to the attached check-out condition record that the renter has signed.</li>
  <li><strong>Damage and loss.</strong> Who pays for new damage, and how it is assessed; what happens if the vehicle is not returned.</li>
  <li><strong>Use restrictions.</strong> Named drivers only; no sub-letting; no use for hire without permission; no off-road unless it is a 4x4 hire; no driving under the influence.</li>
  <li><strong>Insurance.</strong> What cover exists, the excess the renter is liable for, and what voids it.</li>
  <li><strong>Signatures.</strong> Both parties, with date, at check-out.</li>
</ul>

<h2>A plain template</h2>
<p>Adapt the bracketed parts.</p>
<p style="white-space:pre-wrap; border-left:2px solid rgba(16,185,129,.4); padding-left:1rem; color:#94a3b8; font-size:12.5px; line-height:1.7">VEHICLE RENTAL AGREEMENT

This agreement is between [Showroom name], [address], phone [number] ("the Showroom") and [Renter name], CNIC [number], licence [number], address [address], phone [number] ("the Renter").

1. Vehicle: [make/model/year], registration [number], colour [colour]. Odometer at check-out: [reading]. Fuel at check-out: [level].
2. Period: from [date, time] to [date, time].
3. Charges: daily rate Rs [amount] x [n] days = Rs [total]. Grace period [1] hour; overtime Rs [amount] per hour thereafter. Additional charges: [delivery / driver / none].
4. Security deposit: Rs [amount] / [CNIC held]. Deductible only for: new damage, traffic fines, missing fuel, late return, missing accessories.
5. Fuel: return [as received / full]. Mileage: [unlimited / [n] km per day, Rs [amount] per extra km].
6. Condition: the Renter has inspected the Vehicle with the Showroom and agrees the attached condition record is accurate.
7. Damage and loss: the Renter is liable for damage occurring during the period that is not on the condition record, and for the insurance excess of Rs [amount]. If the Vehicle is not returned by [date, time] and no extension is agreed, the Showroom may report it as such.
8. Use: only the Renter and named drivers [names] may drive. No sub-letting, no use for paid carriage without written permission, no off-road use [unless 4x4 hire], no driving under the influence.
9. Insurance: [summary of cover]. Cover does not apply if clause 8 is breached.

Signed, [date]:
Showroom: ____________________   Renter: ____________________</p>

<h2>Send it, do not just file it</h2>
<p>The renter should leave with a copy. A photo or a WhatsApp message of the completed agreement means both sides have the same document. PakEngine builds this slip from the booking and hands it to the renter on WhatsApp at check-out.</p>`,
  },

  {
    slug: 'showroom-record-keeping',
    title: 'Rent-a-car record keeping: what to keep and for how long',
    dek: 'The documents a showroom should be able to produce months later, and a simple way to keep them without a filing room.',
    description:
      'A record-keeping guide for car rental showrooms: which rental, financial and vehicle records to keep, roughly how long to keep them, and how to store them so they survive a lost phone or register.',
    keywords: 'rent a car record keeping, car rental business records, showroom bookkeeping Pakistan, rental documents retention',
    readMin: 5,
    related: [['/guides/rent-a-car-agreement-template', 'The rent-a-car agreement template'], ['/pricing', 'What PakEngine costs']],
    body: `
<p>Good records are not about being audited. They are about being able to answer a question — from a renter, an insurer, a bank or the tax office — that arrives three months after the rental ended. If the answer is in a stack of paper or a lost phone, it is not an answer.</p>
<p>This is general guidance, not tax or legal advice. Confirm retention periods with your accountant.</p>

<h2>Per-rental records</h2>
<ul>
  <li>The signed rental agreement.</li>
  <li>The check-out and check-in condition records, with photos.</li>
  <li>Renter identification: CNIC and licence copies.</li>
  <li>Payment record: amount, date, method, and the reference for any bank transfer.</li>
  <li>Any incident notes: accidents, fines, disputes and how they were resolved.</li>
</ul>
<p>Keep these for at least as long as a dispute or claim could realistically arise — a few years is a safe default, longer if an incident is unresolved.</p>

<h2>Financial records</h2>
<ul>
  <li>Daily takings, ideally reconciled each night.</li>
  <li>Monthly income and expense summaries.</li>
  <li>Invoices and receipts for fuel, maintenance, insurance and licence fees.</li>
  <li>Records tied to any tax filing.</li>
</ul>
<p>Tax-related records are usually kept for around six years; your accountant will confirm the period that applies to you.</p>

<h2>Per-vehicle records</h2>
<ul>
  <li>Registration and token history.</li>
  <li>Service and repair history with odometer readings.</li>
  <li>Insurance policies and claims.</li>
  <li>Purchase and, eventually, sale documents.</li>
</ul>
<p>Keep these for as long as you own the vehicle, plus a few years after you sell it.</p>

<h2>Storing it so it survives</h2>
<p>One physical copy in a drawer is a single point of failure. The practical minimum is: the paper original where you need it, and a digital copy somewhere else.</p>
<ul>
  <li>Photograph signed agreements and condition records the day they are made.</li>
  <li>Keep the day's rental log in a form you can export as one file.</li>
  <li>Back that file up weekly, and after any busy period, to a second device or a drive you control.</li>
</ul>
<p>PakEngine keeps the rental log, condition records and payment notes together on the device, and Export Fleet Backup writes the whole showroom to a single file you can copy anywhere. Nothing is uploaded on your behalf; the backup is yours to place.</p>`,
  },
];

function articleShell(g) {
  return `
<article class="prose-pk mx-auto max-w-2xl py-8">
  <div class="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Guide</div>
  <h1 class="mt-3 font-display text-[25px] font-bold leading-[1.16] tracking-tight text-white [text-wrap:balance] sm:text-[33px]">${g.title}</h1>
  <p class="mt-4 text-[14px] leading-relaxed text-slate-400">${g.dek}</p>
  <p class="mt-3 text-[11px] text-slate-600">PakEngine &middot; Updated ${UPDATED} &middot; ${g.readMin} min read</p>
  <div class="mt-8 text-[13.5px] leading-relaxed text-slate-300">
    ${g.body}
  </div>
  ${
    g.related && g.related.length
      ? `<div class="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
    <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Keep reading</div>
    <ul class="mt-3 space-y-2">${g.related
      .map(
        ([href, label]) =>
          `<li><a href="${href}" class="text-[13px] font-semibold text-emerald-400 underline underline-offset-2 hover:text-emerald-300">${label}</a></li>`
      )
      .join('')}</ul>
  </div>`
      : ''
  }
</article>
${CTA('Put this on one screen.', 'PakEngine keeps the damage map, the agreement and the day&rsquo;s cash together on a phone that works offline. Three days free, no card.')}`;
}

function guideArticle(g) {
  return page({
    slug: `guides/${g.slug}`,
    title: `${g.title} — PakEngine Guides`,
    description: g.description,
    ogTitle: g.title,
    ogImage: `${SITE}/og.jpg`,
    keywords: g.keywords,
    back: { href: '/guides', label: 'All guides' },
    crumbs: [
      ['Home', SITE + '/'],
      ['Guides', SITE + '/guides'],
      [g.title, `${SITE}/guides/${g.slug}`],
    ],
    jsonld: [
      {
        '@type': 'Article',
        headline: g.title,
        description: g.description,
        datePublished: PUBLISHED,
        dateModified: UPDATED_ISO,
        author: { '@type': 'Organization', name: 'PakEngine', url: SITE + '/' },
        publisher: {
          '@type': 'Organization',
          name: 'PakEngine',
          logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png` },
        },
        mainEntityOfPage: `${SITE}/guides/${g.slug}`,
        image: `${SITE}/og.jpg`,
        inLanguage: 'en',
      },
    ],
    body: articleShell(g),
  });
}

function guidesIndex() {
  return page({
    slug: 'guides',
    title: 'Guides for Rent-a-Car Showrooms — PakEngine',
    description:
      'Practical guides for running a car rental showroom in Pakistan: stopping damage disputes, charging overtime, pre-rental inspections, rental agreements and record keeping.',
    ogTitle: 'PakEngine Guides',
    ogImage: `${SITE}/og.jpg`,
    keywords:
      'rent a car guides Pakistan, car rental showroom management, rental damage dispute, rent a car agreement format, pre-rental inspection checklist',
    jsonld: [
      {
        '@type': 'Blog',
        name: 'PakEngine Guides',
        url: `${SITE}/guides`,
        publisher: { '@type': 'Organization', name: 'PakEngine', url: SITE + '/' },
        blogPost: GUIDES.map((g) => ({
          '@type': 'BlogPosting',
          headline: g.title,
          url: `${SITE}/guides/${g.slug}`,
          datePublished: PUBLISHED,
          dateModified: UPDATED_ISO,
        })),
      },
    ],
    body: `
${H1(
  'Guides',
  'Running a rent-a-car showroom, in practice.',
  'Short, specific guides on the parts of the job that cost showrooms money: damage at return, overtime, inspections, agreements and records.'
)}
<section class="py-8">
  <div class="grid gap-4 sm:grid-cols-2">
    ${GUIDES.map(
      (g) => `<a href="/guides/${g.slug}" class="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]">
      <h2 class="text-[15px] font-bold leading-snug text-white">${g.title}</h2>
      <p class="mt-2 flex-1 text-[12.5px] leading-relaxed text-slate-400">${g.dek}</p>
      <span class="mt-4 inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-400">Read the guide <i data-lucide="arrow-right" class="h-3.5 w-3.5 transition group-hover:translate-x-0.5"></i></span>
    </a>`
    ).join('\n    ')}
  </div>
</section>
${CTA('Or just start the trial.', 'See how PakEngine handles all of this on one screen. Three days free, no card.')}
`,
  });
}

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
      'One flat plan for car rental showrooms: 4,000 PKR per month, or 40,000 PKR per year with two months free. One showroom, unlimited vehicles, rentals and staff devices. 3-day free trial, no card required, pay by bank transfer.',
    ogTitle: 'PakEngine Pricing',
    ogDesc: 'Flat 4,000 PKR per month, or 40,000 PKR per year (2 months free). Unlimited vehicles, rentals and staff devices. 3-day free trial, no card required.',
    keywords:
      'rent a car software price Pakistan, car rental management cost, PakEngine pricing, fleet software subscription PKR',
    jsonld: [
      {
        '@type': 'SoftwareApplication',
        name: 'PakEngine Rent Ledger — Showroom Licence',
        description:
          'Flat monthly licence for one car rental showroom. Unlimited vehicles, rentals and staff devices.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web browser, Android, iOS',
        image: `${SITE}/og-pricing.jpg`,
        url: `${SITE}/pricing`,
        publisher: { '@type': 'Organization', name: 'PakEngine', url: SITE + '/' },
        offers: [
          {
            '@type': 'Offer',
            name: 'Monthly licence',
            price: '4000',
            priceCurrency: 'PKR',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'Annual licence',
            price: '40000',
            priceCurrency: 'PKR',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/pricing`,
          },
        ],
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
      <div class="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-300">
        <span>or <span class="font-semibold text-white">Rs.&nbsp;40,000</span> / year</span>
        <span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-300">2 months free</span>
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
      When the trial ends, the app shows your unique Showroom ID and the bank details. Transfer 4,000 PKR for one month, or 40,000 PKR for a full year, and put the Showroom ID in the reference or memo field so the payment can be matched to your account. Send the transfer screenshot on <a href="${WA}" target="_blank" rel="noopener" class="font-semibold text-emerald-400 underline underline-offset-2 hover:text-emerald-300">WhatsApp</a> and your activation key is issued straight away. Each key is tied to your Showroom ID: a monthly key runs for the calendar month, an annual key for twelve months. There is no auto-charge and no card stored anywhere.
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
      'How PakEngine handles data. Your showroom records never leave your device. No cookies, no cross-site tracking, no accounts. This page covers the only data that touches a network: CDN request logs and cookieless page-visit counts.',
    ogTitle: 'PakEngine Privacy Policy',
    ogDesc: 'Your showroom data never leaves your device. No cookies, no cross-site tracking, no accounts.',
    keywords: 'PakEngine privacy policy, local-first data, cookieless analytics rental software, car rental data protection',
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
    <li><strong>Website analytics.</strong> Pages on pakengine.com use Vercel Web Analytics, a cookieless tool run by our hosting provider. It records aggregate page-visit counts, referrer, and rough country, device and browser type. It sets no cookies, stores no persistent identifier, does not track you across other websites, and cannot be used to identify an individual. Your showroom data inside the app is never sent to it. See vercel.com/legal/privacy-policy.</li>
    <li><strong>Upgrade payments.</strong> When you choose to upgrade you send a bank transfer and a WhatsApp message yourself. That interaction is governed by your bank’s and WhatsApp’s own policies. We store only your Showroom ID, showroom name and the contact number you provide, to match the payment and issue a licence key.</li>
  </ul>

  <h2 class="font-display text-[16px] font-bold text-white">What we do not do</h2>
  <ul>
    <li>No cookies, no fingerprinting, no session or screen recording, no advertising trackers.</li>
    <li>No cross-site tracking and no profiling of individuals.</li>
    <li>No account system and no cloud database for your showroom data.</li>
    <li>No selling or sharing of any data.</li>
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
      'The terms for using PakEngine Rent Ledger: the 3-day trial, the 4,000 PKR monthly or 40,000 PKR annual licence, payment by bank transfer, acceptable use, and the limits of liability for a local-first tool.',
    ogTitle: 'PakEngine Terms & Conditions',
    ogDesc: 'The trial, the flat monthly licence, payment, acceptable use and liability — in plain terms.',
    keywords: 'PakEngine terms and conditions, rental software licence, car rental app terms of service',
    body: `
${H1('Legal', 'Terms &amp; Conditions', 'Last updated ' + UPDATED + '.')}
<section class="prose-pk max-w-2xl py-8 text-[13px] text-slate-400">
  <h2 class="font-display text-[16px] font-bold text-white">1. The service</h2>
  <p>PakEngine Rent Ledger is a local-first web application for recording car rental showroom operations. It runs in your browser and stores your data on your device. We provide the software; we do not operate your showroom or hold your records.</p>

  <h2 class="font-display text-[16px] font-bold text-white">2. Free trial</h2>
  <p>New installs receive a 3-day free trial with every feature enabled. The trial begins when you first open your dashboard. When it ends, the app is locked until a valid licence key is entered. Trial data remains on your device and is available again once you upgrade.</p>

  <h2 class="font-display text-[16px] font-bold text-white">3. Licence and payment</h2>
  <p>The licence is 4,000 PKR per calendar month, or 40,000 PKR per year, for one showroom, covering unlimited vehicles, rentals and staff devices. Payment is made by bank transfer with your Showroom ID as the reference. An activation key tied to that Showroom ID is issued once the transfer is confirmed: a monthly key is valid for the calendar month it is issued for, and an annual key is valid for twelve consecutive months from its start month. There is no auto-renewal; you repeat the transfer at the end of the period to continue. Part-period use is not pro-rated or refunded.</p>

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

  ...Object.fromEntries(CITIES.map((c) => [c.slug, cityPage(c)])),

  guides: guidesIndex(),
  ...Object.fromEntries(GUIDES.map((g) => [`guides/${g.slug}`, guideArticle(g)])),

  404: page({
    slug: '404',
    noindex: true,
    title: 'Page not found — PakEngine Rent Ledger',
    description: 'That page could not be found on pakengine.com.',
    keywords: '',
    body: `
<section class="py-16 text-center sm:py-24">
  <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Error 404</div>
  <h1 class="mt-3 font-display text-[28px] font-bold tracking-tight text-white [text-wrap:balance] sm:text-[38px]">This road doesn't lead anywhere.</h1>
  <p class="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-slate-400">The page you asked for isn't here. It may have moved, or the link was mistyped.</p>
  <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
    <a href="/" class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.98]">
      <i data-lucide="arrow-left" class="h-4 w-4"></i> Back to home
    </a>
    <a href="/features" class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:border-white/45 hover:bg-white/5">
      See what PakEngine does
    </a>
  </div>
  <nav class="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12.5px] font-medium text-slate-500" aria-label="Helpful links">
    <a href="/pricing" class="transition hover:text-white">Pricing</a>
    <a href="/faq" class="transition hover:text-white">FAQ</a>
    <a href="/demo" class="transition hover:text-white">Live demo</a>
    <a href="/contact" class="transition hover:text-white">Contact</a>
  </nav>
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
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, PAGES[slug], 'utf8');
  console.log('wrote', `${slug}.html`, `(${PAGES[slug].length} bytes)`);
}

/* sitemap ---------------------------------------------------------- */
// /demo is intentionally excluded — it is a noindex redirect stub, not a rankable page.
const sm = [
  ['/', 'weekly', '1.0'],
  ['/features', 'monthly', '0.8'],
  ['/pricing', 'monthly', '0.8'],
  ['/guides', 'weekly', '0.7'],
  ...GUIDES.map((g) => [`/guides/${g.slug}`, 'monthly', '0.6']),
  ['/faq', 'monthly', '0.7'],
  ...CITIES.map((c) => [`/${c.slug}`, 'monthly', '0.7']),
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

/* Tailwind -> /styles.css  (pages must exist first so the scanner sees them) */
const twCli = resolve(ROOT, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
execFileSync(process.execPath, [twCli, '-i', '_build/tailwind.src.css', '-o', 'styles.css', '--minify'], {
  cwd: ROOT,
  stdio: 'inherit',
});
console.log('compiled styles.css');
