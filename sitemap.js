// sitemap.js — generate sitemap.xml (with per-file <lastmod>) + robots.txt
const fs = require('fs');
const path = require('path');

const root = __dirname;
const siteUrl =
  process.env.SITE_URL ||
  process.env.DEPLOY_PRIME_URL ||
  'https://example.com';

function isoDateFromFile(filePath) {
  try {
    const m = fs.statSync(filePath).mtime;
    return new Date(m).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function collectHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = '/' + path.relative(root, full).replace(/\\/g, '/');
    if (fs.statSync(full).isDirectory()) {
      out.push(...collectHtmlFiles(full));
    } else if (entry.toLowerCase().endsWith('.html')) {
      out.push({ rel, full });
    }
  }
  return out;
}

const files = collectHtmlFiles(root);

const urls = files
  .map(({ rel, full }) => {
    const loc = `${siteUrl}${rel}`;
    const lastmod = isoDateFromFile(full);
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');
console.log('sitemap.xml generated with', files.length, 'URLs.');

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');
console.log('robots.txt generated.');
