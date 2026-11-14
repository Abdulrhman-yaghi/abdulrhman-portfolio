import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const email = "ayaghi.2004@gmail.com";
const noOverflow = () => document.documentElement.scrollWidth <= innerWidth;

for (const width of [320, 390, 768, 1440]) {
  test(`readable layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.locator("summary").click();
    expect(await page.evaluate(noOverflow)).toBe(true);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Stockroom", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Dishly", { exact: true })).toHaveCount(0);
    // The email address is never printed on the page.
    await expect(page.getByText(email)).toHaveCount(0);

    const menu = page.getByRole("button", { name: "Menu" });
    const workLink = page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Work", exact: true });
    if (width < 768) {
      await expect(workLink).toBeHidden();
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await expect(workLink).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toHaveAttribute("aria-expanded", "false");
    } else {
      await expect(menu).toBeHidden();
      await expect(workLink).toBeVisible();
    }

    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    for (const name of ["A project", "Something else"]) {
      await page.getByRole("radio", { name, exact: true }).check();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      expect(await page.evaluate(noOverflow)).toBe(true);
    }
    await page.getByRole("radio", { name: "A bug", exact: true }).check();
    await page.locator("summary").click();
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `qa/layout-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test("keyboard navigation and active section", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();

  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.getByRole("link", { name: "Work", exact: true }).click();
  await expect(
    nav.getByRole("link", { name: "Work", exact: true }),
  ).toHaveAttribute("aria-current", "true");

  await page.getByRole("radio", { name: "A bug", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "A project", exact: true }),
  ).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "Something else", exact: true }),
  ).toBeChecked();
  await page.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details")).toHaveAttribute("open", "");
  for (const link of await page.locator("a").all()) {
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    if (href?.startsWith("#")) await expect(page.locator(href)).toHaveCount(1);
  }
});

test("bug drafts use the edited report; other drafts stay blank", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("link", { name: "Tell me about your bug" }).click();
  await expect(
    page.getByRole("radio", { name: "A bug", exact: true }),
  ).toBeChecked();
  const text =
    "Application: demo\nExpected: save order\nActual: 500 error & retry?";
  await page.getByRole("textbox", { name: /Your bug report/ }).fill(text);

  const mail = new URL(
    (await page
      .getByRole("link", { name: "Email this report" })
      .getAttribute("href"))!,
  );
  expect(mail.protocol).toBe("mailto:");
  expect(mail.pathname).toBe(email);
  expect(mail.searchParams.get("subject")).toBe("Bug report");
  expect(mail.searchParams.get("body")).toBe(text);
  const gmail = new URL(
    (await page
      .getByRole("link", { name: "Open in Gmail instead" })
      .getAttribute("href"))!,
  );
  expect(gmail.hostname).toBe("mail.google.com");
  expect(gmail.searchParams.get("to")).toBe(email);
  expect(gmail.searchParams.get("body")).toBe(text);

  await page.getByRole("button", { name: "Copy the report instead" }).click();
  expect(
    (await page.evaluate(() => navigator.clipboard.readText())).replaceAll(
      "\r\n",
      "\n",
    ),
  ).toBe(text);
  await expect(
    page.getByRole("status", { name: "Report copy status" }),
  ).toHaveText("Bug report copied.");

  for (const name of ["A project", "Something else"]) {
    await page.getByRole("radio", { name, exact: true }).check();
    await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute(
      "href",
      `mailto:${email}`,
    );
    const url = new URL(
      (await page
        .getByRole("link", { name: "Open in Gmail instead" })
        .getAttribute("href"))!,
    );
    expect(url.searchParams.has("body")).toBe(false);
    expect(url.searchParams.has("su")).toBe(false);
  }

  await page
    .getByRole("button", { name: "Copy my email address", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
  await expect(
    page.getByRole("status", { name: "Email copy status" }),
  ).toHaveText("Email address copied.");

  await page.getByRole("link", { name: /Hire me for a project/ }).click();
  await expect(
    page.getByRole("radio", { name: "A project", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(
    page.getByRole("radio", { name: "Something else", exact: true }),
  ).toBeChecked();
  await page.getByRole("link", { name: "Tell me about your bug" }).click();
  await expect(
    page.getByRole("textbox", { name: /Your bug report/ }),
  ).toHaveValue(text);
});

test("reading survives user text spacing and a narrow reflow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("summary").click();
  await page.addStyleTag({
    content:
      "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}",
  });
  expect(await page.evaluate(noOverflow)).toBe(true);
  for (const element of await page
    .locator("h1,h2,h3,p,.button,summary,fieldset")
    .all()) {
    expect(
      await element.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
  }
  await page.screenshot({ path: "qa/text-spacing.png", fullPage: true });
});

test("clipboard failure reveals the address as a manual fallback", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Unavailable")) },
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Copy my email address", exact: true })
    .click();
  await expect(
    page.getByRole("status", { name: "Email copy status" }),
  ).toContainText("Copy wasn’t available");
  await expect(
    page.getByRole("link", { name: email, exact: true }),
  ).toHaveAttribute("href", `mailto:${email}`);
});

test("SEO: metadata, canonical, social cards, and heading structure", async ({
  page,
}) => {
  await page.goto("/");
  const title = await page.title();
  expect(title.length).toBeGreaterThan(10);
  expect(title.length).toBeLessThanOrEqual(60);
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description!.length).toBeLessThanOrEqual(160);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
  ).toMatch(/^https:\/\/[^/]+\/$/);
  for (const property of ["og:title", "og:description", "og:url", "og:image"])
    await expect(page.locator(`meta[property="${property}"]`)).toHaveCount(1);
  expect(
    await page.locator('meta[property="og:image"]').getAttribute("content"),
  ).toMatch(/^https:\/\/.+\/og-image\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator("h1")).toHaveCount(1);
  const levels = await page
    .locator("h1, h2, h3, h4, h5, h6")
    .evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
  levels.forEach((level, i) => {
    if (i > 0) expect(level - levels[i - 1]).toBeLessThanOrEqual(1);
  });
  await expect(page.locator("img:not([alt])")).toHaveCount(0);

  await page.goto("/404.html");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex",
  );
  await expect(
    page.getByRole("link", { name: "Go to the home page" }),
  ).toHaveAttribute("href", "/");
});
