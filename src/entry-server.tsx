// Build-time entry: renders the page to static HTML (see scripts/prerender.mjs),
// so crawlers and link previews get the full content without running JavaScript.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";
export { profile } from "./config";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
