# Travel Power MVP (Netlify-ready)

This repo contains a static site with two tools:
- Plug & Voltage by Country
- Will My Appliance Work Abroad? (adapter vs converter aware)

## Deploy on Netlify (no local steps)

1. Create a new GitHub repo and upload all files in this folder.
2. In Netlify: **Add new site → Import an existing project → GitHub → select repo**.
3. Netlify will read `netlify.toml` and run `node generate.js` automatically.
4. Publish directory is `.` (the repo root). Generated SEO pages appear in `/countries`.

### Local preview (optional)
- `python -m http.server 8000` → open http://localhost:8000
- Or `npx serve`

### Files
- `netlify.toml` — tells Netlify to run `node generate.js` on deploy
- `.nvmrc` / `package.json` — pin Node to 18 (safe default)
- `generate.js` — creates static `/countries/*.html` from `data.json`