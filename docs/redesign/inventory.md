# Project inventory

Recorded before any changes. The repository is `Abdulrhman-yaghi/abdulrhman-portfolio`, deployed to Cloudflare Pages at `https://4a50545b.abdulrhman-portfolio.pages.dev/`.

## Stack

- **Framework:** Vite 8 with React 19 and TypeScript 7. It is a single-page app with no router.
- **Not a static site generator.** There is no front matter, no Markdown content and no Hugo, Jekyll, Astro, Next or Eleventy. All content is hard-coded in `src/App.tsx`.
- **Rendering:** client-side only. The served `index.html` is 735 bytes with an empty `<div id="root">`, so crawlers that don't run JavaScript and link-preview scrapers see no content.
- **Fonts:** self-hosted through `@fontsource`: Geist 400/500/600 and IBM Plex Mono 400. There are no external requests.
- **Checks:** a Playwright suite in `tests/portfolio.spec.ts` covers layout at 320/390/768/1440px, keyboard use, links, clipboard and axe. Linting uses `oxlint`.
- **Deploy:** `npm run build` produces `dist/`. There is no `404.html`, `robots.txt` or `sitemap.xml`. Cloudflare Pages therefore falls back to serving `index.html` with HTTP 200 for every unknown path, `/robots.txt` included.

> The other repository attached to this session, `Abdulrhman-yaghi/portfolio`, is an older, unrelated "space" portfolio built with plain HTML, CSS and jQuery-era JavaScript. It isn't what's deployed, and I left it untouched.

## Files

| Path                             | Role                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                     | HTML shell: title, description, theme colour, favicon                                                                      |
| `src/main.tsx`                   | React entry (`createRoot`)                                                                                                 |
| `src/App.tsx`                    | All markup and copy: header, every section, footer, project data, clipboard helpers                                        |
| `src/App.css`                    | Component styles (1,447 lines, pixel values, four breakpoints)                                                             |
| `src/index.css`                  | Font imports, root colours, focus ring, skip link, reduced-motion reset                                                    |
| `src/config.ts`                  | Public links: email, LinkedIn, GitHub, Upwork, Mostaqel, per-project URLs, Stockroom preview URL. Empty values are hidden. |
| `public/monogram.svg`            | "AY" logo and favicon                                                                                                      |
| `public/stockroom-dashboard.png` | Stockroom screenshot (1440×1241)                                                                                           |
| `tests/portfolio.spec.ts`        | Playwright and axe browser tests                                                                                           |
| `README.md`                      | Run, build and publishing notes                                                                                            |

## Page and sections

There is one page (`/`), in this order:

1. **Header:** brand (monogram, name, "Backend developer") and nav (Services, Work, Process, "Let's talk"). It isn't sticky, has no active state, and hides every link except "Let's talk" below 760px.
2. **Hero (`#home`):** eyebrow "Backend developer · Amman, Jordan", H1 "I fix bugs. You get back to building.", description, CTA "Tell me about your bug", "View my work", "Hire me for a project or volunteer opportunity", the line "Laravel is my strongest professional experience", and an animated "Anatomy of a fix" illustration with a pause button.
3. **Core stack band:** a scrolling marquee of PHP, Laravel, Python, Django, REST APIs, SQL, PostgreSQL and Git.
4. **Services (`#services`, "01 / How I can help"):** four cards.
5. **Work (`#work`, "02 / Selected work"):** Stockroom (featured, with a screenshot, demo and source links), Dishly and Laravel Tasks API (illustrative diagrams, no links). Each card has an "Inside the project" disclosure.
6. **Process (`#process`, "03"):** four steps.
7. **About:** "Hi, I'm Abdulrhman.", two paragraphs, toolkit chips (Filament, Docker, Laravel Passport), location and UTC offset.
8. **Collaborate (`#collaborate`):** "Hire me for a project" and "Invite me to a volunteer project" cards, with Gmail and email-app links.
9. **Contact (`#contact`, "04"):** email address, copy button, Gmail and email-app links, LinkedIn, and a "Report a bug" template with Gmail and email-app links plus a copy button.
10. **Floating pill:** "Have a bug? Let's talk", fixed bottom-right.
11. **Footer:** copyright, tagline, LinkedIn, "Back to top".

## Where key content lives

| Content                         | Location                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                            | `index.html` `<title>`; `src/App.tsx` brand, about H2, footer                                                                                     |
| Role ("Backend developer")      | `src/App.tsx` brand, hero eyebrow, about paragraph                                                                                                |
| Location (Amman, Jordan)        | `src/App.tsx` hero eyebrow, about paragraph, location row                                                                                         |
| Projects                        | `projects` array in `src/App.tsx`; their links are in `src/config.ts` → `projects`, `stockroomPreview`                                            |
| Contact details                 | `src/config.ts`: `email` (public on the page), `linkedin` (public). `github`, `upwork` and `mostaqel` are empty.                                  |
| Profile links shown on the site | LinkedIn `https://www.linkedin.com/in/abdalrhman-yaghi/`. The site also links to the Stockroom repo on GitHub, but no GitHub profile link is set. |
| Resume link                     | **None exists** anywhere in the repo.                                                                                                             |

## Update: changes on `main` after this inventory

Two commits landed on `main` (`3c96e3a`, `6625b54`) while this work was in progress. They:

- simplified the layout to 7 sections
- removed the Dishly and Laravel Tasks API projects (`src/config.ts` lost their link keys), leaving Stockroom as the only case study
- replaced the separate contact links with a contact selector (bug / project / something else) and an editable bug report
- introduced colour tokens in `src/index.css`

The redesign branch is built on top of those commits and keeps their content decisions. See `report.md`.
