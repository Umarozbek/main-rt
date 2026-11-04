# RT Holdings website — build spec for Claude Code

Goal: rebuild the site in `reference/index.html` as a production **Next.js** project that looks and behaves
**the same** as the reference: same layout, colors, fonts, texts, images, animations and timings, at every
screen size from 360px phones to 1920px monitors.

The reference is the single source of truth. When this document and the reference disagree, the reference wins.
Open it locally to compare at any time (`npx serve reference` → http://localhost:3000).

---

## 1. What is in this folder

| Path | What it is |
|---|---|
| `reference/index.html` | The finished, working site (one file: HTML + CSS + JS). Match this exactly. |
| `reference/img/` | Images used by the reference (same files as `public/img/`). |
| `public/img/` | The same 24 images, ready for Next.js `/public`. Do not rename them. |
| `messages/uz.json`, `ru.json`, `en.json` | Every UI text, keyed by the `data-i` attribute used in the reference. UZ is the default language. Values may contain inline HTML (`<em>`, `<br>`): render with `dangerouslySetInnerHTML` or convert to rich text. |
| `data/hero-slides.json` | Hero slider data per language: giant headline words (`g`) and hotspots (`h` = `[x%, y%, title, text]`). |
| `tests/` | Playwright parity and overlap checks to run when you finish (see §9). |

## 2. Stack

- **Next.js 14+ (App Router) + TypeScript**, `npm` (the owner works in Next.js / NestJS).
- **Styling: port the reference CSS as-is** into `app/globals.css` first (it is already organised by section),
  then optionally split it into CSS Modules per component. Do **not** rewrite it in Tailwind; that risks
  visual drift. Keep the `:root` tokens exactly.
- **Fonts via `next/font/google`**: Unbounded (400–700, display), Onest (400–600, body), Oswald (500–700, giant
  hero words and menu), Raleway (300/400/600, hero side text and header links). Expose them as the same
  CSS variables: `--f-display`, `--f-body`, and use Oswald/Raleway where the reference uses them.
- **Animations: plain CSS keyframes + small React hooks** (IntersectionObserver, requestAnimationFrame), as in the
  reference. No animation library is required. If you add one, the result must still match the reference.
- **i18n**: client-side switch UZ / RU / EN using `messages/*.json`, stored in `localStorage` key `rt-lang`,
  and `document.documentElement.lang` updated. (Optional later: `next-intl` with `/uz`, `/ru`, `/en` routes.)
- Static export friendly (`output: 'export'` must work). No backend needed yet; the contact form is a demo
  (see §7).
- Respect `prefers-reduced-motion`: every animation in the reference has a reduced-motion fallback. Keep them.

## 3. Design tokens (copy exactly)

```css
:root{
  --navy:#3A2A22;  --navy-2:#2E211B;  --navy-3:#1F1612;     /* espresso darks */
  --orange:#C9A26B; --amber:#E6CB98;  --orange-ink:#86592E;  /* warm gold, light gold, bronze text */
  --ground:#F6F1E8; --white:#FFFDF9;  --ink:#2A1F1A; --muted:#6E5E52; --rule:#E6DCCD;
  --on-navy:#F3EADF; --on-navy-muted:#CDBBA7;
  --ease:cubic-bezier(.2,.7,.2,1);
  --gl:max(16px, env(safe-area-inset-left, 0px)); --gr:max(16px, env(safe-area-inset-right, 0px));
}
```
Single light theme (no dark mode). Container `.wrap`: max-width 1320px (1480px at ≥1600px).
Breakpoints used: 380, 640, 700, 820, 860, 900/901, 1000, 1180, 1600 px, plus `(max-height:820px)` on desktop
and `(hover:none)` for touch.

## 4. Page structure (in this order) → suggested components

| # | Section (`id`) | Component | Notes |
|---|---|---|---|
| 1 | Header `#hdr` | `Header` | Fixed, transparent over hero; becomes solid espresso after 20px scroll. Burger, logo (dark/white swap), icon links (hidden <700px), UZ/RU/EN pill. |
| 2 | Menu overlay `#menu` | `MenuOverlay` | Full-screen, numbered links 01–08, links stagger in; Esc closes. |
| 3 | Hero `#hx` | `Hero` (+ `HeroSlide`, `Hotspot`, `RouteList`, `ModelPicker`) | The most complex part — see §5. |
| 4 | Brands strip | `BrandMarquee` | Grey logos scrolling, color on hover, pause on hover. |
| 5 | Motion band | `MotionBand` | Two rows of huge words (IMPORT ✦ EKSPORT ✦ LOGISTIKA ✦ MOBILLIK), opposite directions, speed rises with scroll velocity; words follow language. |
| 6 | About `#about` | `About` + `Pillar` ×3 | 3 animated pillars: ship (sways on waves), tanker (bobs on moving road), excavator (rocks). Each drives in from the right when revealed. |
| 7 | Trade `#trade` | `TradeCards` | Export (Volvo excavator) + Import (Kortex Oil, refinery photo, Instagram link). |
| 8 | Fleet `#fleet` | `Fleet` + `SpecDialog` | 3 excavator brand cards (Volvo, Hyundai, Doosan) drive into their cards on scroll with wheel dust; "Xususiyatlar" opens a `<dialog>` spec sheet; "So‘rov yuborish" pre-fills the contact form. |
| 9 | Process `#process` | `ProcessTimeline` | 6 steps; gold line fills with scroll; steps turn dark when passed. Left column sticky on desktop. |
| 10 | Companies `#companies` | `CompanyCard` ×6 | Kortex Oil (wordmark), Dream Express, RT Motors, RT Medline (contact list 2-col), aka taxi, RT Logistics (wordmark with ship). Compact sizes — whole grid fits a 1366×768 screen. |
| 11 | Cargo `#cargo` | `Cargo` + `WorldMap` | Dream Express: poster with shine + floating counters, 2 photos with scan line, dotted world map (see §6), 4 steps, partner line. |
| 12 | aka `#aka` | `AkaApps` | Text only (two cards: taxi / driver). No picture. |
| 13 | News `#news` | `NewsItem` ×2 | Kortex Oil first container (21 may) and World Oil Korea contract (6 mart 2025); second one image-right on ≥820px. |
| 14 | Numbers `#numbers` | `Stats` | 4 tiles: 7 brands, 186+ countries, 2025, 1000+ shipments; numbers count up on reveal. |
| 15 | Contact `#contact` | `ContactSection` | Info panel (+998 94 563 95 95 UZ, +82 10 9687 9796 KR, rtholdingsgroup@gmail.com, Janubiy Koreya) + form. |
| 16 | Footer | `Footer` | White logo, link columns, Instagram links, giant outlined "RT Holdings" that fills with gold as you reach the bottom. |
| 17 | Floating buttons `#fab` | `FloatingActions` | Telegram, WhatsApp (both → `#contact` until real links exist), phone `tel:+998945639595`, back-to-top. Appear after scrolling 60% of a screen. |

Global effects (desktop pointer only, off on touch and reduced motion): custom gold cursor dot + ring that grows
over clickable things, magnetic buttons, 3D tilt on cards (`.co,.tcard,.app,.pillar,.num,.fl`), photo wipe
reveal + scroll parallax, section titles reveal word by word, `.rv` elements fade/rise in when they enter view.

## 5. Hero — exact behaviour

Read the hero part of `reference/index.html` (search `<!-- HERO -->`, `/* hero slider */`, `/* ===== drive-in`,
`// ===== moving vehicles`, `// ===== export slide`) and reproduce:

- **4 slides** from `data/hero-slides.json`: 0 Export (Volvo / Hyundai / Doosan excavators), 1 Import —
  KORTEX OIL (tanker), 2 Logistika — RT LOGISTICS (container ship), 3 Cargo — DREAM EXPRESS (Korea-flag truck).
- **Giant headline**: Oswald 700 uppercase, colour `#8E857B`, two lines. On desktop its size is fitted by JS so the
  widest line ends before the route list: `size = max(70, min(140, 200*avail/width*.78, (innerHeight-200)*.3))` px.
  Phones: `clamp(46px,14.5vw,84px)`. Each change: letters drop in one by one (35ms per letter, 120ms per line).
- **Timer**: one tick every **3 s**. On slide 0 each tick switches excavator brand Volvo → Hyundai → Doosan,
  then goes to slide 1. Other slides stay 2 ticks (6 s). Pause while the pointer is over the vehicle. The active
  route-list item shows a progress bar (9 s on slide 0, 6 s otherwise).
- **Vehicle motion**: new vehicle drives in from the side it faces (`--dir`: 1 = from right, −1 = from left; the
  Korea truck and Hyundai come from the left) over **1.6 s** with brake overshoot; old one drives out over **1.1 s**.
  Body rumbles while driving; dashed road line runs under trucks.
- **Smoke & dust**: every **140 ms** emit exhaust puffs (heavy while driving, light while parked) at fixed exhaust
  points, tire dust while driving, a 3× brake-dust burst at **1150 ms**, white bow wake for the ship. Only while the
  hero is on screen and the tab is visible.
- **Hotspots** (numbered, pulsing) pop in one after another after the vehicle lands; hover/tap shows a tooltip
  (`tip-l` flips left when x > 60%). Excavator hotspots show only for Volvo.
- **Brand badge** (`.mbadge`) sits **above** the vehicle, never on it: VOLVO / HYUNDAI / DOOSAN, KORTEX OIL (with oil
  drop), RT LOGISTICS.
- **Model picker** (`Modellar`, only on slide 0): 3 buttons; tapping drives that brand in.
- **Scroll exit** (≥901px only): vehicle rises, tilts, shrinks and fades; headline sinks; reverses on scroll up.
- **Swipe** on phones: horizontal swipe > 45px changes slide.
- Phone layout (<900px): headline → vehicle → 2×2 route list → model picker → text + buttons.

## 6. World map (cargo section)

Dotted land map (SVG path in the reference, `class="land"`) with Korea hub and 7 arcs to Markaziy Osiyo, MDH,
Yaqin Sharq, Turkiya, Yevropa, Amerika, Janubi-Sharqiy Osiyo. Arcs draw in on reveal, light "comets" streak along
every arc, gold dots travel along them, and every **1.6 s** one route is highlighted (thicker line, gold label, ring
pulse on the destination) while others dim. Copy the SVG markup and the `// ===== world` scripts.

## 7. Content rules

- Use the texts from `messages/*.json` verbatim. Keys match `data-i` attributes in the reference.
- Brand names are never translated: Kortex Oil, Dream Express, RT Motors, RT Medline, RT Logistics, aka taxi,
  World Oil Korea Co., LTD, Volvo, Hyundai, Doosan.
- Links: Instagram `kortex_oil`, `expressbts_kr`, `rtmotors_trade`, `rt_medline`, `akataxi.uz`; Telegram `akataxi`;
  RT Medline site `https://rtmedlineuz.com`; RT Holdings `https://www.rtholdings.uz`.
- Text in square brackets (e.g. `[Yil]`, `[Narx]`, spec values) is a placeholder awaiting real data. Keep it styled
  as in the reference (italic bronze) until the owner supplies values.
- Contact form: client-side validation (name + phone required) and the demo message from `okDemo` / `errReq`.
  Prepare a `POST /api/contact` hook (or NestJS endpoint) but leave it disabled unless the owner provides one.
  "So‘rov yuborish" buttons pre-select the dropdown and pre-fill the message (see reference script).

## 8. Build order

1. Scaffold Next.js + TS, fonts, `globals.css` with the full reference CSS, `public/img`.
2. Static markup for all sections (server components), texts from `messages/uz.json`.
3. Language switcher (client) + `ru/en` texts + hero data per language.
4. Hero (client component) with slider, timers, drive/smoke/dust, hotspots, picker, swipe, fitted headline,
   scroll exit.
5. Scroll reveals, counters, motion band, marquee, process timeline, world map, spec dialog, floating buttons,
   footer fill, desktop-only cursor/magnetic/tilt.
6. Accessibility pass: real buttons/links, `aria-*` as in the reference, focus rings, reduced motion.
7. Run the checks in §9 and fix differences until they pass.

## 9. Acceptance checks (must pass before you say "done")

- `npm run build` succeeds with no TypeScript or ESLint errors; no console errors in the browser.
- **Visual parity**: `tests/parity.spec.ts` screenshots the reference and the new site at **390×844, 1366×768,
  1920×1080** for the top of the page and each section, with animations disabled, and compares them. Fix any
  section that differs visibly.
- **No overlaps**: `tests/overlap.spec.ts` visits every hero slide (and all 3 excavator brands) at 360, 390, 430,
  1024, 1366, 1920 px and fails if a hotspot, badge, route list, hero text block or giant headline overlap each
  other or leave the screen.
- **No horizontal scroll** at 360px and above.
- Language switch changes every visible text (UZ → RU → EN → UZ) and persists after reload.
- Lighthouse (desktop) performance ≥ 85; images served via `next/image` or properly sized.
