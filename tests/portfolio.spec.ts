import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 768, 1440]) {
  test(`readable layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.locator("summary").click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Stockroom", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Dishly", { exact: true })).toHaveCount(0);
    await expect(
      page.getByText("Laravel Tasks API", { exact: true }),
    ).toHaveCount(0);
    expect(
      await page
        .locator(".stack-track")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    expect(
      await page
        .locator(".packet")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    await expect(
      page.getByRole("button", { name: "Pause animation" }),
    ).toBeHidden();
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
            .withTags(["wcag2a", "wcag2aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.getByRole("radio", { name: "A bug", exact: true }).check();
    await page.locator("summary").click();
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `qa/layout-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test("keyboard navigation and motion controls", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("button", { name: "Pause animation" }).click();
  expect(
    await page
      .locator(".packet")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await page.getByRole("button", { name: "Play animation" }).click();
  await page.locator(".stack-window").hover();
  expect(
    await page
      .locator(".stack-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await page.locator(".stack-window").focus();
  await page.mouse.move(0, 0);
  expect(
    await page
      .locator(".stack-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
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

test("bug drafts use edited report; general and project drafts remain blank", async ({
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
  const gmail = new URL(
    (await page
      .getByRole("link", { name: "Report a bug via Gmail" })
      .getAttribute("href"))!,
  );
  expect(gmail.hostname).toBe("mail.google.com");
  expect(gmail.searchParams.get("to")).toBe("ayaghi.2004@gmail.com");
  expect(gmail.searchParams.get("body")).toBe(text);
  const mail = new URL(
    (await page
      .getByRole("link", { name: "Report via my email app" })
      .getAttribute("href"))!,
  );
  expect(mail.searchParams.get("body")).toBe(text);
  await page.getByRole("button", { name: "Copy bug report instead" }).click();
  expect(
    (await page.evaluate(() => navigator.clipboard.readText())).replaceAll(
      "\r\n",
      "\n",
    ),
  ).toBe(text);
  await expect(
    page.getByRole("status", { name: "Template copy status" }),
  ).toHaveText("Bug report copied.");
  for (const name of ["A project", "Something else"]) {
    await page.getByRole("radio", { name, exact: true }).check();
    const url = new URL(
      (await page
        .getByRole("link", { name: "Contact via Gmail" })
        .getAttribute("href"))!,
    );
    expect(url.searchParams.has("body")).toBe(false);
    expect(url.searchParams.has("su")).toBe(false);
    await expect(
      page.getByRole("link", { name: "Use my email app" }),
    ).toHaveAttribute("href", "mailto:ayaghi.2004@gmail.com");
  }
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "ayaghi.2004@gmail.com",
  );
  await expect(
    page.getByRole("status", { name: "Email copy status" }),
  ).toHaveText("Email copied.");
  await page.getByRole("link", { name: /Hire me for a project/ }).click();
  await expect(
    page.getByRole("radio", { name: "A project", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("link", { name: "Contact", exact: false })
    .first()
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
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  for (const element of await page
    .locator("h1,h2,h3,p,.button,summary,fieldset")
    .all()) {
    expect(
      await element.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
  }
  await page.screenshot({ path: "qa/text-spacing.png", fullPage: true });
});

test("clipboard failure keeps a manual way to contact", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Unavailable")) },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Email copy status" }),
  ).toContainText("copy it manually");
  await expect(
    page.getByRole("link", { name: "ayaghi.2004@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:ayaghi.2004@gmail.com");
});
