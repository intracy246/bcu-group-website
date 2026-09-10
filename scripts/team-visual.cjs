/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
  const phase = process.argv[2] || 'before';
  fs.mkdirSync('test-results/team-visual', { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  for (const route of ['/', '/about', '/companies', '/projects', '/impact', '/news', '/careers', '/contact']) {
    const response = await page.goto('http://localhost:3000' + route);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `test-results/team-visual/${phase}-${route.slice(1) || 'home'}.png`, fullPage: true, caret: 'initial' });
    console.log(route, response.status(), await page.title());
  }
  console.log('Browser errors:', JSON.stringify(errors));
  await browser.close();
})();
