import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop: links, keyboard, controls, and accessibility", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  for (const link of await page.locator("a").all()) {
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    if (href?.startsWith("#")) await expect(page.locator(href)).toHaveCount(1);
  }
  await page.getByRole("link", { name: "Tell me about your bug" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await page.getByRole("button", { name: "Copy bug report template" }).click();
  await expect(
    page.getByRole("status", { name: "Template copy status" }),
  ).toHaveText("Template copied to clipboard.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Steps to reproduce:",
  );
  await page.getByRole("link", { name: "Back to top" }).click();
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(
    page.getByRole("button", { name: "Play animation" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".stack-window").hover();
  expect(
    await page
      .locator(".stack-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await page.getByRole("link", { name: "Have a bug? Let’s talk" }).click();
  await expect(page).toHaveURL(/#contact$/);
  for (const summary of await page.locator("summary").all()) {
    await summary.focus();
    await page.keyboard.press("Enter");
  }
  await expect(page.locator("details[open]")).toHaveCount(2);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page
    .locator("details")
    .evaluateAll((nodes) => nodes.forEach((n) => n.removeAttribute("open")));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "qa/desktop.png", fullPage: true });
});

for (const width of [320, 390, 768, 1440]) {
  test(`layout and reduced motion at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".packet")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    await expect(
      page.getByRole("button", { name: "Pause animation" }),
    ).toBeHidden();
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page
        .locator(".stack-track")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");

    for (const summary of await page.locator("summary").all())
      await summary.click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    if (width === 390)
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
    await page.screenshot({ path: `qa/layout-${width}.png`, fullPage: true });
  });
}

test("email choices keep general messages blank and prefill only bug reports", async ({
  page,
}) => {
  await page.goto("/");
  const generalGmail = new URL(
    (await page
      .getByRole("link", { name: "Contact via Gmail", exact: true })
      .getAttribute("href"))!,
  );
  expect(generalGmail.hostname).toBe("mail.google.com");
  expect(generalGmail.searchParams.get("to")).toBe("ayaghi.2004@gmail.com");
  expect(generalGmail.searchParams.has("su")).toBe(false);
  expect(generalGmail.searchParams.has("body")).toBe(false);
  await expect(
    page.getByRole("link", { name: "Use my email app", exact: false }),
  ).toHaveAttribute("href", "mailto:ayaghi.2004@gmail.com");
  const template = await page.locator(".brief pre").innerText();
  const bugGmail = new URL(
    (await page
      .getByRole("link", { name: "Report a bug via Gmail" })
      .getAttribute("href"))!,
  );
  expect(bugGmail.searchParams.get("to")).toBe("ayaghi.2004@gmail.com");
  expect(bugGmail.searchParams.get("su")).toBe("Bug report");
  expect(bugGmail.searchParams.get("body")).toBe(template);
  const bugMail = new URL(
    (await page
      .getByRole("link", { name: "Report via my email app" })
      .getAttribute("href"))!,
  );
  expect(bugMail.protocol).toBe("mailto:");
  expect(bugMail.pathname).toBe("ayaghi.2004@gmail.com");
  expect(bugMail.searchParams.get("body")).toBe(template);
  await expect(
    page.getByRole("link", { name: "Connect on LinkedIn" }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/abdalrhman-yaghi/");
});

test("copy email and reach paid or volunteer contact without a bug template", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Email copy status" }),
  ).toHaveText("Email copied to clipboard.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "ayaghi.2004@gmail.com",
  );
  for (const name of [
    "Discuss a project via Gmail",
    "Share an opportunity via Gmail",
  ]) {
    const url = new URL(
      (await page.getByRole("link", { name }).getAttribute("href"))!,
    );
    expect(url.searchParams.get("to")).toBe("ayaghi.2004@gmail.com");
    expect(url.searchParams.has("body")).toBe(false);
    expect(url.searchParams.has("su")).toBe(false);
  }
});
