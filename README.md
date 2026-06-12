# North Coast Build

Marketing site for **North Coast Build** — modern websites and AI automations for
local businesses in Aurora and the greater Cleveland area.

It's a static, no-build site (plain HTML/CSS/JS). Its one job is to make hiring
feel safe and obvious: show the before/after, state the prices, and get the visitor
to book a call or request a free 5-minute audit.

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hook, proof, offer, how it works, featured work, FAQ |
| `work.html` | Portfolio — before/after case studies (grows by one per job) |
| `services.html` | Packages & pricing + automation-only track |
| `about.html` | Short, human credibility |
| `contact.html` | Booking form + direct contact |
| `404.html` | Friendly not-found page |

## Run locally
No tooling required. Either:
- Open `index.html` directly in a browser, **or**
- Serve the folder (keeps relative paths clean):
  ```bash
  python -m http.server 5050
  # then visit http://localhost:5050
  ```

## Deploy (GitHub Pages)
1. Push this folder to a GitHub repo.
2. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)`.
3. (Optional) Add a custom domain `northcoastbuild.com` and create a `CNAME` file.

## Before going live — checklist
- [ ] **Contact form:** create a free form at [formspree.io](https://formspree.io),
      then in `contact.html` replace `REPLACE_WITH_ID` in the `<form action="...">`
      with your form ID. Until then the form falls back to opening the visitor's
      email app (still works, just less seamless).
- [x] **Booking link:** every "Book a call" button opens Calendly
      (`calendly.com/vcannata24-bw/30min`); the contact page also has a
      lazy-loaded inline calendar.
- [ ] **Real screenshots:** swap the placeholder mockups on `work.html` for real
      before/after images of your builds — this is the biggest credibility lever.
- [ ] **Domain:** confirm/buy `northcoastbuild.com`; the social/meta tags already
      reference it. If you use a different domain, find-and-replace it across the
      `og:` / `canonical` tags.

## Notes
- Brand mark: "NC" monogram (`favicon.svg`).
- Social share image: `og-image.png` (1200×630).
- Design system: warm editorial — Fraunces (display serif), Bricolage Grotesque
  (UI), Inter (body); warm cream paper with amber + green accents. All shared
  styles live in `styles.css`.

© 2026 North Coast Build — Aurora, Ohio.
