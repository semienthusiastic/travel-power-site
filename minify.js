// minify.js — compress HTML, CSS, and JS in place
const fs = require('fs');
const path = require('path');
const htmlMinifier = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const terser = require('terser');

async function minifyFolder(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await minifyFolder(fullPath);
    } else if (file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const result = await htmlMinifier.minify(content, { collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: true });
      fs.writeFileSync(fullPath, result);
    } else if (file.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const result = new CleanCSS().minify(content);
      fs.writeFileSync(fullPath, result.styles);
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const result = await terser.minify(content);
      fs.writeFileSync(fullPath, result.code);
    }
  }
}

minifyFolder(__dirname).then(() => console.log('Minification complete'));
