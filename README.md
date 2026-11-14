# Abdulrhman Yaghi portfolio

A React, TypeScript, and Vite portfolio for backend development and application bug fixes.

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

Cloudflare Pages deploys the main branch with framework preset None, build command npm run build, and output directory dist. The source repository remains private.

## Design and reading

The navy background and slate sections preserve the original identity. Off white is the main text color, lighter neutral text carries descriptions, and muted teal highlights actions. Amber is reserved for keyboard focus and the illustrated failed request. Shared color tokens are in src/index.css.

Most body copy is 16 to 19 pixels with comfortable line spacing. Technical captions are secondary. The page uses simple section dividers, a real project screenshot, visible navigation, and a single contact area. Stockroom is currently the only published case study. Further projects can be added when their implementations are ready.

The request illustration uses CSS 3D and has a pause control. The core skills ribbon stops on hover or keyboard focus. Both become static under reduced motion, with all skills wrapping into view.

Design references: [visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/), [contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), and [text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

## Contact behavior

Edit src/config.ts for public contact and project links. Missing profile links are hidden. Email and LinkedIn are configured.

The email address always opens a blank message and can be copied. The contact selector offers a bug report, a project inquiry, or a general message. Only a bug report adds a subject and body to Gmail or the default email app. Visitors can edit the report before opening their draft. Project inquiries, including volunteer opportunities, open blank drafts.

No message is submitted from this website. The report stays in React memory for the current page visit and is not saved to a server or browser storage.

## Verification

```sh
npx playwright install chromium
npm test
```

The browser suite covers widths of 320, 390, 768, and 1440 pixels, keyboard controls, contrast scans in each contact mode, reduced motion, clipboard fallback, edited bug drafts, blank general drafts, and user text spacing. Screenshots are generated in qa and excluded from Git. Automated checks do not replace a screen reader review.

## Optional content

Supply Upwork and Mostaqel profile links when ready. Add only project outcomes and testimonials that can be supported by evidence. The Stockroom screenshot contains fictional demo data.
