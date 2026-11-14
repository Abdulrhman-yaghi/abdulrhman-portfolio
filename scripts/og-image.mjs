// Generates public/og-image.png (1200x630) from the AY monogram and the site's fonts.
// Run with `npm run og-image` after changing the name, role or headline.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const font = (pkg, file) =>
  `data:font/woff2;base64,${fs.readFileSync(path.join(root, "node_modules/@fontsource", pkg, "files", file)).toString("base64")}`;
const monogram = fs.readFileSync(
  path.join(root, "public/monogram.svg"),
  "utf8",
);

const html = `<!doctype html><html><head><style>
@font-face { font-family: Fraunces; font-weight: 500; src: url(${font("fraunces", "fraunces-latin-500-normal.woff2")}); }
@font-face { font-family: Geist; font-weight: 400; src: url(${font("geist", "geist-latin-400-normal.woff2")}); }
@font-face { font-family: Geist; font-weight: 600; src: url(${font("geist", "geist-latin-600-normal.woff2")}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; color: #f5f1ea; font-family: Geist; overflow: hidden;
  background: radial-gradient(900px 480px at 90% -10%, rgb(94 234 212 / .10), transparent 70%),
              radial-gradient(700px 400px at 0% 110%, rgb(242 180 65 / .10), transparent 70%), #0b1220; }
.wrap { position: absolute; inset: 76px 84px; display: flex; flex-direction: column; }
.top { display: flex; align-items: center; gap: 18px; font-size: 28px; font-weight: 600; }
.top svg { width: 64px; height: 64px; }
.kicker { margin-top: auto; display: flex; align-items: center; gap: 14px; font-size: 26px; color: #b3bcc9; }
.kicker i { width: 12px; height: 12px; border-radius: 50%; background: #5eead4; box-shadow: 0 0 0 6px rgb(94 234 212 / .15); }
h1 { margin-top: 22px; font-family: Fraunces; font-weight: 500; font-size: 92px; line-height: 1.02; letter-spacing: -.025em; }
.cta { margin-top: 40px; align-self: flex-start; padding: 16px 30px; border-radius: 999px; background: #f2b441; color: #0b1220; font-size: 24px; font-weight: 600; }
</style></head><body><div class="wrap">
<div class="top">${monogram}<span>Abdulrhman Yaghi</span></div>
<p class="kicker"><i></i>Backend developer in Amman, Jordan</p>
<h1>I fix bugs in<br>web applications.</h1>
<div class="cta">Laravel · Python · Django</div>
</div></body></html>`;

// CHROME_PATH is optional: point it at a local Chromium if Playwright's own browser isn't installed.
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, "public/og-image.png") });
await browser.close();
console.log("wrote public/og-image.png");
