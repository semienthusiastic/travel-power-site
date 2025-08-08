
// generate.js — create /countries/*.html from data.json
const fs = require('fs'); const path = require('path');
const tpl = (c) => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><title>${c.country} Plug Type & Voltage</title>
<link rel="stylesheet" href="../style.css"></head><body>
<header><h1>${c.country}: Plug Types, Voltage & Adapter Guide</h1></header>
<main>
<p><strong>Plug Types:</strong> ${c.plugTypes.join(', ')}</p>
<p><strong>Voltage:</strong> ${c.voltage}V</p>
<p><strong>Frequency:</strong> ${c.frequency} Hz</p>
${c.notes ? `<p><em>${c.notes}</em></p>` : ''}
<p><a href="https://www.amazon.com/s?k=universal+travel+adapter+type+${c.plugTypes[0]}" target="_blank" rel="nofollow noopener">Buy Adapter on Amazon</a></p>
<p><a href="../appliance-checker.html">Check if your device will work here</a></p>
</main></body></html>`;

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
