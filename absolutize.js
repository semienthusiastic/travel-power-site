
// absolutize.js — convert internal links to absolute canonical URLs using SITE_URL
const fs = require('fs');
const path = require('path');

const root = __dirname;
const SITE_URL = (process.env.SITE_URL || process.env.DEPLOY_PRIME_URL || 'https://example.com').replace(/\/+$/,'');

function walk(dir, files=[]) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (name.toLowerCase().endsWith('.html')) files.push(full);
  }
  return files;
}

function makeCanonicalTag(url) {
  return `<link rel="canonical" href="${url}">`;
}

function absolutize(html, filePath) {
  const rel = '/' + path.relative(root, filePath).replace(/\\/g,'/');
  const url = SITE_URL + rel;
  let out = html;

  // Rewrite root-relative href/src to absolute
  out = out.replace(/(href|src)=["']\/(.*?)["']/g, (m, attr, p) => `${attr}="${SITE_URL}/${p}"`);

  // Ensure/refresh canonical tag
  if (out.match(/rel=["']canonical["']/i)) {
    out = out.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, makeCanonicalTag(url));
  } else {
    out = out.replace(/<\/head>/i, `${makeCanonicalTag(url)}\n</head>`);
  }
  return out;
}

const files = walk(root);
files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const updated = absolutize(html, f);
  fs.writeFileSync(f, updated);
});
console.log(`Absolutized ${files.length} HTML files with SITE_URL=${SITE_URL}`);
