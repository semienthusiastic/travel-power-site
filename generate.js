// generate.js — tolerant of plugTypes vs plug_types; frequency number/string
const fs = require('fs');
const path = require('path');
const data = require('./data.json');

const siteUrl = process.env.SITE_URL || 'https://example.com';
const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const countriesDir = path.join(__dirname, 'countries');
if (!fs.existsSync(countriesDir)) fs.mkdirSync(countriesDir);

function normPlugs(entry) {
  const plugs = entry.plug_types || entry.plugTypes || entry.plugs;
  if (Array.isArray(plugs)) return plugs;
  if (typeof plugs === 'string') return plugs.split(/[\s,]+/).filter(Boolean);
  return [];
}
function normFreq(entry) {
  const f = entry.frequency;
  if (typeof f === 'number') return `${f}Hz`;
  if (typeof f === 'string') return /hz$/i.test(f) ? f : `${f}Hz`;
  return '';
}

function htmlPage(title, body, desc, urlPath) {
  const canonical = `${siteUrl}${urlPath}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelInformation",
    "name": title,
    "description": desc,
    "mainEntityOfPage": canonical,
    "url": canonical,
    "dateModified": today,
    "publisher": {
      "@type": "Organization",
      "name": "TravelPlugGuide",
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/assets/logo-128.png` }
    }
  };
  const meta = `
<link rel="canonical" href="${canonical}">
<meta name="description" content="${desc}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${siteUrl}/assets/logo-128.png">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${siteUrl}/assets/logo-128.png">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
`;
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · TravelPlugGuide</title>
${meta}
<link rel="icon" href="/assets/favicon.ico">
<link rel="stylesheet" href="/style.css">
</head><body>
<header>
<div class="logo"><img class="logo-mark" src="/assets/logo-32.png" alt=""><strong>TravelPlugGuide</strong></div>
<nav class="nav">
<a href="/index.html">Home</a>
<a href="/plug-voltage.html">Plug & Voltage</a>
<a href="/appliance-checker.html">Appliance Checker</a>
<a href="/blog/index.html">Blog</a>
</nav>
</header>
<main>
${body}
</main>
<footer>
<div class="small">© ${new Date().getFullYear()} TravelPlugGuide · <a href="/privacy.html">Privacy</a> · <a href="/disclosure.html">Affiliate Disclosure</a></div>
</footer>
</body></html>`;
}

data.forEach(entry => {
  const country = entry.country;
  const slug = country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g,'');
  const plugs = normPlugs(entry);
  const freq = normFreq(entry);
  const desc = `In ${country}, the standard voltage is ${entry.voltage}V at ${freq}, and plugs are type ${plugs.join(', ')}. Learn if you need an adapter or converter before you travel.`;

  const affiliateBlock = `
<div class="affiliate-box">
<strong>Need a travel adapter for ${country}?</strong><br>
<a href="https://www.amazon.com/s?k=travel+adapter+${encodeURIComponent(country)}+plug&tag=YOURTAGHERE" target="_blank" rel="nofollow sponsored">Buy a suitable adapter on Amazon</a>
</div>`;
  const lastUpdated = `<p class='small'>Last updated: ${today}</p>`;
  const body = `<h1>Plug & Voltage Info for ${country}</h1><p>${desc}</p>${affiliateBlock}${lastUpdated}`;

  const html = htmlPage(`Travel Plug & Voltage Info for ${country}`, body, desc, `/countries/${slug}.html`);
  fs.writeFileSync(path.join(countriesDir, `${slug}.html`), html);
});

console.log(`Generated ${data.length} country pages`);
