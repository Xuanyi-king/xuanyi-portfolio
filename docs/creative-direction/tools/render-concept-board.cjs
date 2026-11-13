// Requires the environment's Playwright and Chromium; changes no project dependency.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const docs = path.resolve(__dirname, '..');
  const svg = fs.readFileSync(path.join(docs, 'concept-atlas.svg'));
  const server = http.createServer((req, res) => {
    if (req.url !== '/concept-atlas.svg') { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    res.end(svg);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/chromium', headless: true });
    const page = await browser.newPage({ viewport: { width: 1600, height: 1470 } });
    await page.goto(`http://127.0.0.1:${server.address().port}/concept-atlas.svg`);
    await page.screenshot({ path: path.join(docs, 'evidence/concept-atlas.png') });
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})();
