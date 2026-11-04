// Visual parity: screenshots the reference and the new site with motion frozen and compares them.
// Start the reference with:  npx serve reference -l 4000     and the app with:  npm run dev  (port 3000)
import { test, expect, Page } from '@playwright/test';

const REF = process.env.REF_URL || 'http://localhost:4000';
const APP = process.env.BASE_URL || 'http://localhost:3000';
const SIZES: [number, number][] = [[390,844],[1366,768],[1920,1080]];
const SECTIONS = ['top','#about','#trade','#fleet','#process','#companies','#cargo','#aka','#news','#numbers','#contact','footer'];

async function shot(page: Page, url: string, w: number, h: number, sel: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: w, height: h });
  await page.goto(url);
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
  await page.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
  if (sel !== 'top') await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  return page.screenshot();
}

for (const [w, h] of SIZES) for (const sel of SECTIONS) {
  test(`parity ${sel} @ ${w}x${h}`, async ({ browser }) => {
    const a = await browser.newPage(); const b = await browser.newPage();
    const ref = await shot(a, REF, w, h, sel);
    await test.info().attach('reference', { body: ref, contentType: 'image/png' });
    const app = await shot(b, APP, w, h, sel);
    await test.info().attach('app', { body: app, contentType: 'image/png' });
    // Compare the app against the reference image of the same viewport.
    expect(app).toMatchSnapshot(`${sel.replace(/\W/g, '') || 'top'}-${w}.png`, { maxDiffPixelRatio: 0.03 });
    await a.close(); await b.close();
  });
}
// First run: `npx playwright test tests/parity.spec.ts --update-snapshots` with APP pointed at the REFERENCE
// (BASE_URL=http://localhost:4000) to record baselines, then run normally against the app.
