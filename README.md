# Abdulrhman Yaghi — backend portfolio

Responsive React + TypeScript + Vite portfolio focused on Laravel and Django bug fixes. Fonts are self-hosted. The original AY SVG is both the logo and favicon. The CSS 3D request trace needs no WebGL, has a pause control, and becomes static under reduced motion.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. For subdirectory hosting, set Vite's `base` to that path before building.

## Public links

Edit **src/config.ts** for email, GitHub, Upwork, Mostaqel, and per-project URLs. Empty values are hidden. There is no message submission backend. The main CTA leads to the contact section, where visitors can copy a bug report template. Until contact links are supplied, the page clearly explains this limitation.

## Before publishing

- Supply the email or preferred contact channel, Upwork and Mostaqel profile URLs, and optional GitHub/project URLs.
- Confirm permission to name VKHBP publicly and share the described contributions.
- Supply specific project outcomes and verification evidence. The current case studies explicitly state evidence limitations rather than claim unverified results.
- For the Tasks API DELETE example, provide the original route, reproduction steps, root cause, change, and verification result. No resolution is invented in this version.

Project diagrams are original illustrations, not screenshots of production systems. They contain no client data, internal endpoints, logs, or credentials.

## Checks

```sh
npx playwright install chromium
npx playwright test
```

The browser suite checks 320, 390, 768, and 1440px layouts, horizontal overflow, reduced motion, keyboard access, links, case-study disclosure controls, clipboard behavior, runtime errors, and axe WCAG A/AA checks including contrast. Screenshots are generated in `qa/` and excluded from Git. Automated accessibility testing does not replace a screen-reader review.
