
// generate.js — create /countries/*.html from data.json
const fs = require('fs'); const path = require('path');
const tpl = (c) => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.country} Plug Type & Voltage · TravelPlugGuide</title>
<meta name="description" content="${c.country} plug types, voltage and frequency. Find the right travel adapter.">
<link rel="icon" href="/assets/favicon.ico"><link rel="stylesheet" href="/style.css"></head>
<body>
<header><div class="logo"><img class="logo-mark" src="/assets/logo-32.png" alt=""><strong>TravelPlugGuide</strong></div>
<nav class="nav"><a href="/index.html">Home</a><a href="/plug-voltage.html">Plug & Voltage</a><a href="/appliance-checker.html">Appliance Checker</a><a href="/blog/index.html">Blog</a></nav>
</header>
<main>
<h1>${c.country}: Plug Types, Voltage & Adapter Guide</h1>
<p><strong>Plug Types:</strong> ${c.plugTypes.join(', ')}</p>
<p><strong>Voltage:</strong> ${c.voltage}V</p>
<p><strong>Frequency:</strong> ${c.frequency} Hz</p>
${c.notes ? `<p><em>${c.notes}</em></p>` : ''}
<p><a href="https://www.amazon.com/s?k=universal+travel+adapter+type+${c.plugTypes[0]}&tag=YOURTAGHERE" target="_blank" rel="nofollow noopener">Buy Adapter on Amazon</a></p>
<p><a href="/appliance-checker.html">Check if your device will work here</a></p>
</main>
<footer><div class="small">© 2025 TravelPlugGuide · <a href="/privacy.html">Privacy</a> · <a href="/disclosure.html">Affiliate Disclosure</a></div></footer>
</body></html>`;

(async () => {
  const data = JSON.parse(fs.readFileSync('./data.json','utf8'));
  const outDir = path.join(__dirname, 'countries');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  data.forEach(c => {
    const safe = c.country.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    fs.writeFileSync(path.join(outDir, `${safe}.html`), tpl(c), 'utf8');
  });
  console.log('Generated country pages in /countries');
})();
