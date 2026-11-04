# RT Holdings — Claude Code build kit

Everything Claude Code needs to rebuild the new RT Holdings website as a Next.js + TypeScript project.

## How to use

1. Unzip this into your empty project folder (so `CLAUDE.md` is at the root).
2. Open the folder in Claude Code.
3. Paste the text of `BUILD_PROMPT.md` as your first message.
4. Claude Code reads `CLAUDE.md` automatically and builds the site, then runs the tests in `tests/`.

To see the target design at any time: `npx serve reference -l 4000` → http://localhost:4000

## Contents

- `CLAUDE.md` — full build spec: stack, tokens, sections, animations and timings, acceptance checks
- `BUILD_PROMPT.md` — the first message to give Claude Code
- `reference/` — the finished design (single HTML file + images), the source of truth
- `public/img/` — the 24 images the site uses
- `messages/` — all texts in UZ / RU / EN
- `data/hero-slides.json` — hero slider headlines and hotspots per language
- `tests/` + `playwright.config.ts` — overlap and visual-parity checks

## Still needed from the client

- Kortex Oil logo file (a text wordmark is used for now)
- Year of the first Kortex Oil container (21 May)
- Telegram and WhatsApp links for the floating buttons
- Real values for the `[bracketed]` placeholders (excavator specs, prices)
- Approval of the RT Logistics description (written by us, not the client)
