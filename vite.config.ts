import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { profile } from "./src/config.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Writes the production address from src/config.ts into index.html.
      name: "site-url",
      transformIndexHtml: (html) =>
        html.replaceAll("%SITE_URL%", profile.siteUrl),
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
    },
  },
});
