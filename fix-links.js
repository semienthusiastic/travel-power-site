
// fix-links.js — replace any hard-coded *.netlify.app links with root-relative paths
const fs = require('fs');
const path = require('path');
const root = __dirname;
const NETLIFY_RE = /https?:\/\/[a-z0-9.-]*netlify\.app(\/[a-z0-9_\-./]*)/gi;

function walk(dir, acc=[]) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (name.toLowerCase().endsWith('.html')) acc.push(full);
  }
  return acc;
}

function toRelative(urlPath) {
  if (!urlPath || urlPath === '/') return '/';
  const known = ['/index.html','/plug-voltage.html','/appliance-checker.html','/blog/index.html'];
  if (known.includes(urlPath)) return urlPath;
  if (/^\/[a-z0-9\-]+$/.test(urlPath)) return urlPath + '.html';
  return urlPath;
}

const files = walk(root);
files.forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  const updated = html.replace(NETLIFY_RE, (_, p1) => toRelative(p1));
  if (updated !== html) {
    fs.writeFileSync(f, updated);
    console.log('Rewrote Netlify links in', path.relative(root, f));
  }
});
console.log('fix-links.js complete');
