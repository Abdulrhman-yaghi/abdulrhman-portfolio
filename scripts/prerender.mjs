// Runs after `vite build` and the SSR build of src/entry-server.tsx.
// 1. Injects the server-rendered app into dist/index.html (content visible without JS).
// 2. Adds Person JSON-LD built from src/config.ts (only links that are public on the site).
// 3. Writes dist/sitemap.xml and dist/robots.txt using VITE_SITE_URL from .env.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const site = loadEnv("production", root, "VITE_").VITE_SITE_URL?.replace(
  /\/$/,
  "",
);
if (!site) throw new Error("VITE_SITE_URL is not set (see .env)");

const { render, profile } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdulrhman Yaghi",
  jobTitle: "Backend Developer",
  url: `${site}/`,
  image: `${site}/og-image.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amman",
    addressCountry: "Jordan",
  },
  knowsAbout: [
    "PHP",
    "Laravel",
    "Python",
    "Django",
    "REST APIs",
    "SQL",
    "PostgreSQL",
  ],
  // No email here on purpose: the owner prefers it not to be repeated across the site.
  sameAs: [
    profile.linkedin,
    profile.github,
    profile.upwork,
    profile.mostaqel,
  ].filter(Boolean),
};
// Escape "<" so the JSON can never close the script tag early.
const jsonLd = `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>`;

const indexPath = path.join(dist, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
if (!html.includes("<!--app-->") || !html.includes("<!--json-ld-->"))
  throw new Error(
    "dist/index.html is missing the <!--app--> or <!--json-ld--> placeholder",
  );
// Preload the two fonts used above the fold, so the hero doesn't re-wrap
// (and shift) when they arrive. Their file names are hashed by Vite.
const assets = fs.readdirSync(path.join(dist, "assets"));
const preloads = [
  /^fraunces-latin-500-normal-.*\.woff2$/,
  /^geist-latin-400-normal-.*\.woff2$/,
]
  .map((pattern) => assets.find((file) => pattern.test(file)))
  .filter(Boolean)
  .map(
    (file) =>
      `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`,
  )
  .join("\n    ");
html = html
  .replace("<!--app-->", render())
  .replace("<!--json-ld-->", `${preloads}\n    ${jsonLd}`);
fs.writeFileSync(indexPath, html);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
);
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(
  `prerendered dist/index.html, wrote sitemap.xml and robots.txt for ${site}`,
);
