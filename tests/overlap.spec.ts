// Hero overlap check. Run against the new site (BASE_URL) and, for comparison, the reference.
// The new site must keep these selectors/ids from the reference:
//   #stage .slide(.on), .hs (hotspot), .mbadge, #routes, .hx-copy, #giant, .rbtn[data-s], .mbtn[data-m]
import { test, expect } from '@playwright/test';

const SIZES: [number, number][] = [[360,780],[390,844],[430,932],[1024,700],[1366,768],[1920,1080]];
const BASE = process.env.BASE_URL || 'http://localhost:3000';

const CHECK = () => {
  const out: string[] = [];
  const R = (e: Element) => e.getBoundingClientRect();
  const sl = [...document.querySelectorAll('#stage .slide')].find(s => s.classList.contains('on'))!;
  const els = [...sl.querySelectorAll<HTMLElement>('.hs,.mbadge')]
    .filter(e => e.offsetParent !== null && getComputedStyle(e).opacity !== '0' && R(e).width > 0);
  const extra = [document.getElementById('routes'), document.querySelector('.hx-copy'), document.getElementById('giant')]
    .filter((e): e is HTMLElement => !!e && (e as HTMLElement).offsetParent !== null);
  const name = (e: Element) => e.classList.contains('hs') ? 'hotspot ' + e.textContent!.trim() : (e.id || e.className.split(' ')[0]);
  const hit = (a: Element, b: Element) => { const r = R(a), q = R(b);
    return !(r.right <= q.left + 1 || q.right <= r.left + 1 || r.bottom <= q.top + 1 || q.bottom <= r.top + 1); };
  for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) if (hit(els[i], els[j])) out.push(name(els[i]) + ' x ' + name(els[j]));
  for (const e of els) {
    for (const x of extra) { if (x.id === 'giant' && e.classList.contains('mbadge')) continue; if (hit(e, x)) out.push(name(e) + ' x ' + name(x)); }
    const r = R(e); if (r.left < 0 || r.right > innerWidth) out.push(name(e) + ' off-screen');
  }
  if (document.documentElement.scrollWidth > innerWidth + 1) out.push('horizontal scroll');
  return out;
};

for (const [w, h] of SIZES) {
  test(`hero has no overlaps at ${w}x${h}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.setViewportSize({ width: w, height: h });
    await page.goto(BASE);
    await page.waitForTimeout(2600);
    const problems: string[] = [];
    for (let s = 0; s < 4; s++) {
      if (s) { await page.click(`.rbtn[data-s="${s}"]`); await page.waitForTimeout(2400); }
      if (s === 0) {
        for (let m = 0; m < 3; m++) {
          if (m) { await page.click(`.mbtn[data-m="${m}"]`); await page.waitForTimeout(2300); }
          (await page.evaluate(CHECK)).forEach(p => problems.push(`slide0/model${m}: ${p}`));
        }
      } else {
        (await page.evaluate(CHECK)).forEach(p => problems.push(`slide${s}: ${p}`));
      }
    }
    expect(errors, 'page errors').toEqual([]);
    expect(problems).toEqual([]);
  });
}
