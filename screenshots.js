const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  const logs = [], failed = [];
  page.on('pageerror',      err => logs.push('❌ JS: ' + err.message));
  page.on('console',        msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('requestfailed',  req => failed.push(req.url() + ' → ' + req.failure().errorText));

  const out = path.join(__dirname, 'evidencias');
  fs.mkdirSync(out, { recursive: true });

  await page.goto('http://localhost:3000/planos', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  console.log('=== CONSOLE ===');
  logs.slice(0, 20).forEach(l => console.log(l));
  console.log('=== FALHAS DE REQUEST ===');
  failed.slice(0, 10).forEach(f => console.log(f));

  const rootEmpty = await page.evaluate(() => document.getElementById('root')?.innerHTML.trim() === '');
  console.log('root vazio:', rootEmpty);

  await page.screenshot({ path: path.join(out, 'debug.png'), fullPage: true });
  await browser.close();
})();
