# Portfolio redesign: SEO, UI/UX, before and after

This branch is built on top of `main` at `6625b54` ("Document design choices and updated contact behavior"), so it merges without conflicts. It keeps the content decisions from that commit (Stockroom as the only case study, the contact selector with an editable bug report) and replaces the visual design and page structure.

**Positioning:** at your request the site presents you as someone who **builds** web applications and **fixes** them, with equal weight. The headline is "I build and fix web applications.", the hero offers "Tell me about your project" (primary) and "Something broken? Report a bug", the services are split into "Build something new" and "Fix what's broken", and "A project" is the default contact option.

Three versions are compared throughout:

- **Original:** `b0e6020`, the deployed site when this work started.
- **main:** `6625b54`, your redesign, committed in parallel.
- **New:** this branch.

## How this was measured

- **Lighthouse ran against local production builds, not the live URL,** because the work environment's network blocks `*.pages.dev`. Every version was built with `npm run build` and served by a small static server that behaves like Cloudflare Pages: gzip, immutable `/assets` caching, and `404.html` for unknown paths when it exists, otherwise the SPA fallback. Each form factor was run 3 times and the median kept. Live numbers will differ somewhat; the comparison is like for like.
- **Accessibility:** axe-core 4.14 (WCAG 2.0/2.1 A and AA plus best practices) at 390, 768 and 1440px, with every `<details>` opened. The test suite also runs axe with `wcag22aa` in every contact mode at 320, 390, 768 and 1440px.
- **Contrast:** measured from rendered pixels. The script hides the text, samples the real background behind every text element (so gradients and cards count), and computes the WCAG ratio. Files: `*-contrast.json`.
- **Screenshots:** full page at 390, 768 and 1440px for the home and 404 pages, in `before/`, `main/` and `after/`. Side by side (original | main | new): `compare-desktop-first-screen.png` and `compare-mobile-first-screen.png`.

## 1. Results at a glance

|                                            | Original                              | main                          | New                                 |
| ------------------------------------------ | ------------------------------------- | ----------------------------- | ----------------------------------- |
| Lighthouse mobile (Perf / A11y / BP / SEO) | 98 / 100 / 100 / 92                   | 99 / 100 / 100 / 92           | **99 / 100 / 100 / 100**            |
| Lighthouse desktop                         | 100 / 100 / 100 / 92                  | 100 / 100 / 100 / 92          | **100 / 100 / 100 / 100**           |
| Mobile LCP / FCP / TBT / CLS               | 2.1 s / 1.8 s / 0 ms / 0.003          | 1.9 s / 1.6 s / 10 ms / 0.002 | 1.9 s / 1.6 s / 0 ms / **0**        |
| axe violation types                        | 2                                     | 1                             | **0**                               |
| Smallest text                              | 6px                                   | 12px                          | **14px**                            |
| Distinct font sizes (1440px)               | 20                                    | 14                            | **9**                               |
| Main sections                              | 8 + floating pill                     | 7                             | **5**                               |
| Email address printed on the page          | once                                  | once                          | **never**                           |
| Email links on the page                    | 9 (5 mailto + 4 Gmail), in 3 sections | 3                             | **2, both inside the contact card** |
| Content in the served HTML (no JS)         | 735 bytes, no `<h1>`                  | 735 bytes, no `<h1>`          | **14 KB, full page**                |
| Unknown URL                                | home page, HTTP 200                   | home page, HTTP 200           | **404 page, HTTP 404**              |

The axe violations were:

- **Original:** the brand link's `aria-label` didn't include its visible text, and the floating pill sat outside every landmark.
- **main:** the two contact buttons had `aria-label`s ("Report a bug via Gmail") that didn't include their visible text ("Open Gmail").

The new design uses no `aria-label` overrides on links, so names always match what's visible.

Lighthouse raw files: `baseline-lighthouse*.json`, `main-lighthouse*.json`, `after-lighthouse*.json`. Axe logs: `before-a11y.txt`, `main-a11y.txt`, `after-a11y.txt`.

## 2. SEO

| Check                        | Original and main                                      | New                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<html lang>`                | `en`                                                   | `en`                                                                                                                                                                    |
| Title                        | "Abdulrhman Yaghi — Application Bug Fixes" (40)        | "Abdulrhman Yaghi builds and fixes web applications" (50), matching the hero, with no separator                                                                         |
| Description                  | 135 chars                                              | 154 chars: "Backend developer in Amman, Jordan. I build web applications and APIs, mainly in Laravel, and fix bugs in existing ones: login, database and queue issues." |
| Canonical                    | missing                                                | `https://abdulrhman-portfolio.pages.dev/` (your README confirms this is the live site)                                                                                  |
| Open Graph / Twitter         | none                                                   | 10 OG + 5 Twitter tags, `summary_large_image`                                                                                                                           |
| Share image                  | none                                                   | `public/og-image.png`, 1200×630, in the new style (AY monogram, Fraunces headline)                                                                                      |
| Person JSON-LD               | none                                                   | name, jobTitle, url, image, address (Amman, Jordan), knowsAbout, sameAs (LinkedIn). **No email**, as you asked.                                                         |
| `robots.txt` / `sitemap.xml` | missing (HTML served instead, which caused the SEO 92) | generated at build; allow all; sitemap lists `/`                                                                                                                        |
| 404                          | soft 404                                               | static `404.html`, HTTP 404, `noindex`, one H1, links home and to contact                                                                                               |
| Crawlable content            | empty `<div id="root">`                                | full page prerendered at build, then hydrated                                                                                                                           |
| Headings                     | one H1, in order                                       | one H1, H1 → H2 → H3 with no skips (enforced by a test)                                                                                                                 |
| Image alt                    | complete                                               | complete                                                                                                                                                                |

- **The 404 page has no canonical, on purpose.** Error pages are `noindex`, and a canonical would contradict that.
- **The production address is stored once,** as `siteUrl` in `src/config.ts` next to your other public links. Change one line for a custom domain. (An earlier version kept it in a committed `.env` file; it was public, never a secret, but `.env` files are now ignored by Git.)
- **Preview deployments** (for example a branch URL) canonicalise to production, so they don't compete in search.

## 3. Design

### Structure: answer the visitor's questions in order

| #   | Section                   | Question it answers                                                                                                                                                                                                                                                                                                                                              | Theme |
| --- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | **Hero**                  | "Who is this, and can they help me?" Headline "I build and fix web applications.", a two-sentence description, the primary CTA "Tell me about your project", a "Something broken? Report a bug" link, three short facts, and a "How it works" card (You tell me what you need → I plan it, or trace it → You get software that works).                           | navy  |
| 2   | **What I can help with**  | "Do they do what I need?" Two groups side by side: **Build something new** (web applications, APIs & integrations, features for existing apps) and **Fix what's broken** (bug fixes, APIs & authentication, SQL & database issues, queues & deployments). The build items rest on what the site already shows: Stockroom, REST APIs, Laravel Passport, Filament. | paper |
| 3   | **Recent work**           | "Can they show it?" Stockroom: screenshot, three outcomes, demo and source, "What I built and tested".                                                                                                                                                                                                                                                           | navy  |
| 4   | **Hi, I'm Abdulrhman**    | "Who will I be working with?" Two short paragraphs and skills grouped in plain words (most experience / also / tools).                                                                                                                                                                                                                                           | paper |
| 5   | **What can I help with?** | "How do I start?" The contact selector (A project, the default / A bug / Something else), one email button, LinkedIn.                                                                                                                                                                                                                                            | navy  |

Removed, because they added noise without helping a visitor decide:

- The separate four-step process section. Its content now lives in the hero's "How it works" card.
- The scrolling skills ribbon. Skills moved into About as a readable, static list.
- The animated request diagram and its pause button.
- Mono uppercase labels, numbered eyebrows ("01 /"), and terminal widgets.

### Email: shown once at most, and only when needed

- The address is **not printed anywhere** on the page, and it's no longer in the JSON-LD.
- The contact card has **one** email button. It reads "Email this report" for bugs, otherwise "Email me", and opens the visitor's mail app with a draft. "Open in Gmail instead" sits beside it. Nothing is sent automatically.
- "Copy my email address" copies it without displaying it. **Only if copying fails** does the page reveal the address, so the visitor still has a way to reach you.
- The footer and the other sections carry no email links.

### Palette

Both themes start from your navy `#0B1220`. There are three hues plus neutrals: navy, amber, and a small amount of teal.

| Role                               | Navy sections (hero, work, contact)                               | Paper sections (services, about)                                                  |
| ---------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ~60% background                    | `#0B1220`                                                         | `#F7F3EC` warm paper                                                              |
| ~30% surfaces and text             | cards `#131D31`; headings and body `#F5F1EA`; secondary `#B3BCC9` | cards `#FFFFFF`; headings `#0B1220`; body `#2E3748`; secondary `#576173`          |
| ~10% accent (interactive only)     | amber `#F2B441` buttons and links; hover `#F7C866`                | amber `#F2B441` buttons with a `#8A5600` border; links `#8A5600`; hover `#6E4400` |
| Secondary accent (never clickable) | teal `#5EEAD4`: logo, status dot, step numbers, checkmarks        | teal `#0F6E64`: service icons                                                     |

Why this palette:

- **Warmer.** Warm paper and off-white text replace the all-navy, cool-grey surfaces of both earlier versions. That's the biggest single change to how "human" the page feels.
- **Reading-heavy sections are dark on light,** because long-form text reads more easily in that polarity. Navy bookends keep your identity, and the dark Stockroom screenshot sits on navy where it looks native.
- **Amber marks every action:** buttons, links, focus, the active nav item, the selected contact option. Amber sits almost opposite navy on the colour wheel, so actions stand out without being bigger or louder. On paper, amber fill doesn't contrast enough with the page (1.67:1), so paper buttons get a dark-amber border (5.56:1) and paper links use dark amber. It's the same hue family, and the rule stays consistent.

**Light and dark mode:** the site has no theme switch, before or after. It declares `color-scheme: dark` for the navy chrome and `light` inside paper sections, so form controls and scrollbars match each section.

### Typography and spacing

- **Fonts:** Fraunces 500 (a soft, warm serif) for H1 and H2; Geist for everything else. IBM Plex Mono was removed. Both fonts are self-hosted, and the two used above the fold are preloaded. Fraunces adds 18 KB.
- **Type scale:** fluid and modular, ratio 1.2 at 390px rising to 1.25 at 1440px. Body text is 17px on phones and 19px on desktop. The smallest text is 14px (captions). Prose is capped at `34em` (about 62–72 characters per line).

| Token       | Use             | 390px → 1440px |
| ----------- | --------------- | -------------- |
| `--step-n1` | captions, chips | 14.2 → 15.2px  |
| `--step-0`  | body            | 17 → 19px      |
| `--step-1`  | lead, H3        | 20.4 → 23.8px  |
| `--step-2`  | card heading    | 24.5 → 29.7px  |
| `--step-3`  | project title   | 29.4 → 37.1px  |
| `--step-4`  | H2              | 35.3 → 46.4px  |
| `--step-5`  | H1              | 42.3 → 58px    |

- **Spacing:** a 4px scale (`--space-1` 4px … `--space-9` 96px). Sections use `clamp(72px, …, 136px)` of vertical padding.
- **Shape:** pill buttons and chips, 20px-radius cards with a soft shadow on paper, and no hard borders between sections. Everything is softer than the old boxed, terminal look.

### Interaction

- **Header:** sticky, with an amber active-section indicator (`aria-current`). Below 768px there's an accessible menu button (`aria-expanded`, closes on Escape or link click).
- **States:** hover, active and `:focus-visible` on every control. Focus is a 3px amber ring on navy and dark amber on paper.
- **Contact options** are real radio buttons styled as pills, so arrow keys work.
- **Motion:** none continuous. Small hover transitions are switched off under `prefers-reduced-motion`.
- **Touch targets:** buttons, nav links, the menu, contact options, the summary and text links are ≥ 44px tall.

## 4. Contrast: every text and button pair (new design, rendered pixels)

All 93 text elements at 1440px and 90 at 390px pass WCAG AA. The lowest is **5.56:1**.

| Text pair                           | Colours                                      | Ratio            | Needs |
| ----------------------------------- | -------------------------------------------- | ---------------- | ----- |
| Headings / body on navy             | `#F5F1EA` / `#0B1220`                        | 16.63:1          | 4.5   |
| Headings / body on navy cards       | `#F5F1EA` / `#131D31`                        | 14.95:1          | 4.5   |
| Secondary text on navy              | `#B3BCC9` / `#0B1220`                        | 9.77:1           | 4.5   |
| Secondary text on navy cards        | `#B3BCC9` / `#131D31`                        | 8.78:1           | 4.5   |
| Headings on paper                   | `#0B1220` / `#F7F3EC`                        | 16.93:1          | 4.5   |
| Headings on white cards             | `#0B1220` / `#FFFFFF`                        | 18.72:1          | 4.5   |
| Body on paper (about text, chips)   | `#2E3748` / `#F7F3EC`                        | 10.81:1          | 4.5   |
| Secondary text on white cards       | `#576173` / `#FFFFFF`                        | 6.25:1           | 4.5   |
| Secondary text on paper             | `#576173` / `#F7F3EC`                        | 5.65:1           | 4.5   |
| Links on navy                       | `#F2B441` / `#0B1220`                        | 10.15:1          | 4.5   |
| Links on navy cards                 | `#F2B441` / `#131D31`                        | 9.12:1           | 4.5   |
| Links on paper (lowest on the page) | `#8A5600` / `#F7F3EC`                        | 5.56:1           | 4.5   |
| Link hover on navy / paper          | `#F7C866` / `#0B1220`; `#6E4400` / `#F7F3EC` | 11.95:1 / 7.63:1 | 4.5   |
| **Button** label on amber           | `#0B1220` / `#F2B441`                        | 10.15:1          | 4.5   |
| Button hover                        | `#0B1220` / `#F7C866`                        | 11.95:1          | 4.5   |
| Selected contact option             | `#0B1220` / `#F2B441`                        | 10.15:1          | 4.5   |
| Unselected contact option / menu    | `#F5F1EA` / `#131D31`                        | 14.95:1          | 4.5   |

| UI component (WCAG 1.4.11)                    | Colours                          | Ratio            | Needs |
| --------------------------------------------- | -------------------------------- | ---------------- | ----- |
| Amber button vs navy                          | `#F2B441` / `#0B1220`            | 10.15:1          | 3     |
| Amber button border vs paper                  | `#8A5600` / `#F7F3EC`            | 5.56:1           | 3     |
| Pill and textarea borders vs navy / navy card | `#7A8AA3` / `#0B1220`, `#131D31` | 5.34:1 / 4.80:1  | 3     |
| Focus ring on navy / navy card                | `#F2B441`                        | 10.15:1 / 9.12:1 | 3     |
| Focus ring on paper / white                   | `#8A5600`                        | 5.56:1 / 6.16:1  | 3     |
| Active nav indicator vs header                | `#F2B441` / `#0B1220`            | 10.15:1          | 3     |
| Teal step numbers vs navy card                | `#5EEAD4` / `#131D31`            | 11.4:1           | 3     |

## 5. Files changed (relative to `main`)

**Modified**

- `src/App.tsx`: new structure, sections, contact card without a printed email, mobile menu, active nav, line icons
- `src/App.css`: rewritten mobile-first on theme tokens
- `src/index.css`: palette, two section themes, fluid type scale, spacing, fonts
- `src/main.tsx`: hydrates prerendered HTML; normal render in dev
- `index.html`: title, description, canonical, OG, Twitter, colour scheme, placeholders for prerender and JSON-LD
- `vite.config.ts`: builds `index.html` and `404.html`
- `package.json`, `package-lock.json`: build runs the prerender; `og-image` script; adds `@fontsource/fraunces`; removes `@fontsource/ibm-plex-mono`
- `tests/portfolio.spec.ts`: keeps all of main's coverage (WCAG 2.2 axe in every contact mode, text spacing, clipboard fallback, draft contents), adapted to the new page, plus mobile menu, active nav, SEO tags, heading order and "email never printed"
- `README.md`: design, build and contact sections updated

**Added**

- `404.html`, `src/not-found.css`
- `src/entry-server.tsx`, `scripts/prerender.mjs`: prerender, font preloads, JSON-LD, sitemap, robots
- `scripts/og-image.mjs`, `public/og-image.png`
- `docs/redesign/`: this report, `inventory.md`, Lighthouse, axe and contrast data, screenshots

**Unchanged:** `src/config.ts`, `public/monogram.svg`, `public/stockroom-dashboard.png`, `playwright.config.ts`.

**Checks:** `npm run build` passes (tsc, Vite, SSR prerender), `oxlint` gives 0 warnings, Prettier is clean, and **all 9 tests pass**. All in-page anchors resolve. The Stockroom repo and its GitHub Pages demo are confirmed public. LinkedIn and Gmail couldn't be reached from the work environment, so click those once after deploying.

## 6. Content I'd still improve (not changed)

1. **Add a photo.** A friendly headshot in the About section, or beside the hero, is the single biggest "human" signal still missing. None exists in the repo.
2. **Name your current role, if you're happy to.** "Laravel is my strongest professional experience" doesn't say where. Your old site said "Web Developer @Clickit-jo". If that's current, "Laravel developer at Clickit" is more concrete. I didn't add it because I can't verify it.
3. **A second case study.** One project is honest, but a second, even a small one with a link, would strengthen "Recent work".
4. **Resume.** There is no resume link. Add a URL or PDF and it can go in About and the contact card.
5. **Response expectations.** A line like "I usually reply within a day" reassures visitors, but only add it if it's true.

## 7. Questions

1. **Projects vs. bug fixes:** the site now gives both equal weight. If you'd like project work to lead even more strongly (for example, a "Recent work" section above services), that's a small reorder.
2. **Skills grouping:** is "Most experience: Laravel, PHP, REST APIs / Also: Python, Django, SQL, PostgreSQL, Git / Tools: Filament, Docker, Laravel Passport" accurate?
3. **Profiles:** should GitHub (`github.com/Abdulrhman-yaghi`) appear in the contact section and JSON-LD? Do you have Upwork or Mostaqel profiles to add?
4. **Domain:** will a custom domain replace `abdulrhman-portfolio.pages.dev`? It's one line in `src/config.ts`.
