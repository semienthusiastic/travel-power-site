# TravelPlugGuide — Static Site

A lightweight, SEO-friendly site that tells travellers which **plug types** and **voltage** each country uses,
and whether a device needs an **adapter** or **converter**. Deploys on Netlify with an automated build.

## What’s inside
- `/index.html` — homepage
- `/plug-voltage.html` — tool: country plug & voltage lookup
- `/appliance-checker.html` — tool: adapter vs converter advice
- `/countries/` — generated SEO pages for each country (created at build time)
- `/blog/` — two starter articles
- `/assets/` — logo + favicons
- `data.json` — country data source
- `generate.js` — builds country pages with meta, OG/Twitter, JSON-LD, affiliate block, last updated
- `minify.js` — minifies HTML/CSS/JS
- `sitemap.js` — creates `sitemap.xml` and `robots.txt`
- `netlify.toml` — Netlify build configuration
- `package.json` — dependencies for the minifier scripts

## One‑time setup (Netlify via GitHub)
1. Create a **GitHub repo** and upload all files in this folder.
2. In **Netlify**: *Add new site → Import an existing project → GitHub → select repo*.
3. Netlify will read `netlify.toml` and run the build automatically.

### Build command (from `netlify.toml`)
```
node generate.js && node minify.js && SITE_URL=$DEPLOY_PRIME_URL node sitemap.js
```

### (Optional) Set your custom domain URL
In Netlify’s **production** context, `SITE_URL` is set to:
```
https://travelplugguide.com
```
You can change that in `netlify.toml` once your domain is connected.

## Local preview (optional)
You don’t need this for Netlify, but to preview locally:
```
# Generate country pages
node generate.js

# Start a simple server (Python)
python -m http.server 8000
# Visit http://localhost:8000
```

## Editing data
- Open `data.json` and add/edit countries. Example entry:
```json
{ "country": "Japan", "plugTypes": ["A","B"], "voltage": 100, "frequency": "50/60Hz" }
```
> Note: If you see `plug_types` in some files, that’s okay — the generator expects `plug_types`. Use the included `data.json` as the source of truth.

- Commit changes → Netlify rebuilds `/countries` automatically.

## Amazon affiliate tag
Search for `YOURTAGHERE` and replace it with your Amazon Associates tag (e.g., `tag=mytag-21`). You’ll find it in:
- `script.js`
- `/blog/*.html`
- `generate.js` (for the country affiliate block)

## Where to check after deploy
- `https://<your-site>.netlify.app/robots.txt`
- `https://<your-site>.netlify.app/sitemap.xml`
- `https://<your-site>.netlify.app/countries/japan.html`
- `https://<your-site>.netlify.app/blog/`

## Troubleshooting
- **No country pages?** Ensure Netlify is using the provided `netlify.toml`, or run `node generate.js` locally and re‑deploy.
- **Broken tool selects?** Confirm `data.json` exists at the repo root and is valid JSON.
- **No OG/Twitter images?** Make sure `/assets/logo-128.png` is present (it is, by default).

---

© 2025 TravelPlugGuide