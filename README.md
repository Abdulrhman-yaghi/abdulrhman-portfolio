# Abdulrhman Yaghi portfolio

A React, TypeScript, and Vite portfolio for a backend developer who builds web applications and fixes bugs in existing ones.

Live website: https://abdulrhman-portfolio.pages.dev/

## Local development

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Cloudflare Pages deploys the main branch with framework preset None, build command npm run build, and output directory dist. Vite 8 needs Node 20.19 or newer in the Pages build settings.

The build also:

- prerenders the page into `dist/index.html` (`src/entry-server.tsx` and `scripts/prerender.mjs`), so crawlers and link previews see the content without JavaScript; the browser then hydrates it
- preloads the two above-the-fold fonts, adds Person JSON-LD built from src/config.ts (no email), and writes `sitemap.xml` and `robots.txt`
- emits a static, `noindex` `404.html`, which Cloudflare Pages serves with HTTP 404 for unknown paths

The production address for canonical, Open Graph, JSON-LD and sitemap URLs is `siteUrl` in src/config.ts. `public/og-image.png` (1200×630) is regenerated with `npm run og-image`.

## Design and reading

The page answers a visitor's questions in order: what I do (hero, with a three-step "How it works" card), what I can help with, proof (Stockroom), who I am, and how to get in touch.

Navy opens and closes the page; warm paper sections carry the longer reading, because dark text on a light background is easier to read at length. Amber is the only interactive colour (bright on navy, dark on paper); teal is a small secondary accent that never marks a control. Headings use Fraunces, body text uses Geist. Tokens for colour, the fluid type scale (17 to 19 pixel body text) and spacing are in src/index.css, and each section picks a `theme-navy` or `theme-paper` class.

There are no continuous animations. Stockroom is currently the only published case study. Further projects can be added when their implementations are ready. Design rationale, contrast ratios and before/after measurements are in docs/redesign/report.md.

Design references: [visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/), [contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), and [text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

## Contact behavior

Edit src/config.ts for public contact and project links. Missing profile links are hidden. Email and LinkedIn are configured.

The email address is not printed on the page. Visitors use the contact card's email button or copy the address with a button; the address is only shown if copying fails. The contact selector offers a project inquiry (the default), a bug report, or a general message. Only a bug report adds a subject and body to Gmail or the default email app. Visitors can edit the report before opening their draft. Project inquiries, including volunteer opportunities, open blank drafts.

No message is submitted from this website. The report stays in React memory for the current page visit and is not saved to a server or browser storage.

## Verification

```sh
npx playwright install chromium
npm test
```

The browser suite covers widths of 320, 390, 768, and 1440 pixels, the mobile menu and active navigation state, keyboard controls, contrast scans in each contact mode, reduced motion, clipboard fallback, edited bug drafts, blank general drafts, user text spacing, SEO metadata and heading order, and that the email address is not printed on the page. Screenshots are generated in qa and excluded from Git. Automated checks do not replace a screen reader review.

## Optional content

Supply Upwork and Mostaqel profile links when ready. Add only project outcomes and testimonials that can be supported by evidence. The Stockroom screenshot contains fictional demo data.
