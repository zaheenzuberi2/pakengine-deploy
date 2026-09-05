# PakEngine Rent Ledger — deploy

Static single-file PWA. No build step. `index.html` is the whole app.

| File | Purpose |
|---|---|
| `index.html` | The entire app (HTML + Tailwind CDN + Lucide + inline JS). Landing page → onboarding → dashboard, 3-day trial engine, bank-transfer paywall, fleet + scratch mapper. |
| `sw.js` | Offline service worker (network-first, cached fallback). Registered by `index.html` automatically. |
| `robots.txt` | Allows crawling. |
| `vercel.json` / `netlify.toml` | Cache + security headers. Use whichever host you pick. |

---

## Option A — Vercel

**One-off from this folder (no repo needed):**
```bash
cd pakengine-deploy
npx vercel        # first run: log in + link/create a project
npx vercel --prod # promote to production
```

**Or connect a Git repo** (auto-deploy on push):
1. Push this folder to a GitHub repo (see "Git" below).
2. vercel.com → Add New → Project → import the repo.
3. Framework preset: **Other**. Build command: *(empty)*. Output dir: `.`
4. Deploy.

**Custom domain:** Vercel project → Settings → Domains → add `pakengine.com` and `www.pakengine.com`, then at your registrar set the records Vercel shows (apex `A 76.76.21.21`, `www` `CNAME cname.vercel-dns.com`).

---

## Option B — Netlify

**Fastest, no CLI:** drag this `pakengine-deploy` folder onto <https://app.netlify.com/drop>.

**CLI from this folder:**
```bash
cd pakengine-deploy
npx netlify deploy          # preview URL
npx netlify deploy --prod   # production
```

**Or connect a Git repo:** Netlify → Add new site → Import from Git → pick the repo. Build command: *(empty)*. Publish directory: `.`

**Custom domain:** Site → Domain management → add `pakengine.com`; either delegate DNS to Netlify (set nameservers at your registrar) or add the `A`/`CNAME` records Netlify shows. Netlify provisions HTTPS automatically.

---

## Git (for the repo-connected route)

```bash
cd pakengine-deploy
git init
git add -A
git commit -m "PakEngine Rent Ledger v2.4.1"
git branch -M main
git remote add origin https://github.com/<you>/pakengine.git
git push -u origin main
```

## Updating later

Replace `index.html` with the new build, bump `CACHE` in `sw.js` (e.g. `pakengine-2.4.2`) so clients pull the update, commit, and push / re-run the deploy command.
