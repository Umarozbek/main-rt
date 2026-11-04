Build the RT Holdings website in this folder as a Next.js 14 (App Router) + TypeScript project.

Read CLAUDE.md first; it is the full spec. The finished design is reference/index.html (open it with
`npx serve reference -l 4000`). The new site must look and behave the same: same layout, colours, fonts, texts,
images, animations and timings at every width from 360px to 1920px.

Rules:
1. Do not redesign anything. Copy the reference CSS into app/globals.css first, keep the class names and ids, and
   only then split it into components.
2. Texts come from messages/uz.json, ru.json, en.json (keys = data-i attributes in the reference). Hero data comes
   from data/hero-slides.json. Images are already in public/img. Do not rename files.
3. Port every script behaviour from the reference into React client components and hooks: hero slider (3 s tick,
   excavator brand cycle, drive-in/out, smoke, tire dust, ship wake, hotspots, model picker, swipe, fitted giant
   headline, scroll exit), scroll reveals, counters, motion band, brand marquee, process timeline, world map,
   spec dialog, floating buttons, footer fill, desktop cursor/magnetic/tilt, language switch saved in
   localStorage `rt-lang`, and reduced-motion fallbacks.
4. Work in the order of CLAUDE.md §8 and use a task list. After each section, compare it with the reference in the
   browser at 390px and 1366px before moving on.
5. When done, install @playwright/test, run `npx playwright test` (tests/overlap.spec.ts and tests/parity.spec.ts,
   see CLAUDE.md §9), `npm run build`, and fix everything until it all passes. Then tell me what is left
   (placeholders in [brackets], missing Kortex Oil logo, Telegram/WhatsApp links).
