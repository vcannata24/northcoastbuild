# North Coast Build — site

Marketing/closer site for Vincent Cannata's web + AI automation business serving
local businesses in Aurora / greater Cleveland. The site's only job: make hiring
him feel safe and obvious, then drive one action (book a call / free 5-min audit).

## Stack
Plain static HTML/CSS/JS — **no build step, no frameworks, no libraries**.
Keep it that way unless explicitly asked.

- `styles.css` — single shared stylesheet. Design system: "Warm Editorial" —
  Fraunces (display serif, italic `em` highlights in green), Bricolage Grotesque
  (UI/buttons), Inter (body). Warm cream paper `#FAF5EC`, amber `#E0712F` actions,
  green `#2C7A53` accents. Motion uses the `--ease-out` / `--ease-soft` /
  `--dur-*` vars; transform/opacity only.
- Contact form posts to Formspree (`formspree.io/f/xlgkorqo`) with a mailto
  fallback if the request fails.
- `script.js` — vanilla JS: mobile nav, FAQ accordion, staggered scroll reveals
  (reveal classes are *removed* after playing so hover timings reset), contact
  form (Formspree + mailto fallback), and showpieces (hero typing/build sequence,
  count-up, 3D device tilt, magnetic buttons, cursor glow, scroll progress bar).
  Everything respects `prefers-reduced-motion` and `pointer: fine` gates.

## Conventions
- The user is **Vincent** (never "Vince") — see About page copy.
- Voice: plain-English, owner-facing, no jargon, no hype. Prices stated openly.
- Every page keeps "Book a call" + free-audit CTAs visible (nav + banner).
- Booking: "Book a call" buttons open Calendly (`calendly.com/vcannata24-bw/30min`)
  in a new tab; the contact page has a lazy-loaded inline embed (`#calendly-embed`).
- Work page grows one case study per finished job; keep the before/after +
  one-sentence-result format.
- Icons are inline SVG (no emoji, no icon fonts). `em` inside headlines = green
  italic editorial highlight.

## Run / preview
`python -m http.server 5050` from this folder (or `.claude/launch.json` in the
parent dir has a `vince-site` config). Don't open pages with a preview rooted at
a parent folder — relative CSS/JS paths will 404.

## Pending (owner-provided)
- Real before/after screenshots → replace stylized placeholders in `work.html`
  (drop files in `assets/`, convert to WebP, add alt text).
- Confirm/purchase `northcoastbuild.com` — all `og:`/`canonical` tags assume it.
