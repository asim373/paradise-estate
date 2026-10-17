import { expect, test } from "@playwright/test";

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page, path: string, project: string) {
  const dimensions = await page.evaluate(() => ({ width: window.innerWidth, documentWidth: document.documentElement.scrollWidth }));
  expect(dimensions.documentWidth, `${path} overflow in ${project}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.width);
}

test("responsive navigation opens, exposes five links, supports Escape, and navigates", async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const width = testInfo.project.use.viewport?.width ?? 0;
  if (width >= 1280) {
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "About Us" })).toBeVisible();
  } else {
    const toggle = page.getByRole("button", { name: "Open navigation" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
    const nav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(nav.getByRole("link")).toHaveCount(5);
    await expect(nav.getByRole("link", { name: "About Us" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Properties" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Home" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await nav.getByRole("link", { name: "Properties" }).click();
    await expect(page).toHaveURL(/\/properties$/, { timeout: 30_000 });
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
  }
  await assertNoHorizontalOverflow(page, "/", testInfo.project.name);
  await page.screenshot({ path: testInfo.outputPath("responsive-home.png"), fullPage: true, caret: "initial" });
  expect(pageErrors).toEqual([]);
});

test("responsive filters, detail gallery, and contact form remain usable", async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/properties");
  await expect(page.getByLabel("Keyword search")).toBeVisible();
  await page.getByLabel("City").selectOption("new-york");
  await expect(page.getByText(/Showing\s+2\s+of\s+8\s+residences/)).toBeVisible();
  await assertNoHorizontalOverflow(page, "/properties", testInfo.project.name);

  await page.goto("/properties/miami/coral-gables-courtyard");
  await page.waitForLoadState("networkidle");
  const gallery = page.getByLabel("Coral Gables Courtyard image gallery");
  await expect(gallery.locator("img")).toHaveCount(1);
  await expect(gallery.getByText("1 / 8")).toBeVisible();
  await gallery.getByRole("button", { name: "Next image in Coral Gables Courtyard gallery" }).tap();
  await expect(gallery.getByText("2 / 8")).toBeVisible();
  if (testInfo.project.use.hasTouch) {
    await gallery.scrollIntoViewIfNeeded();
    const box = await gallery.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const session = await page.context().newCDPSession(page);
      const x = box.x + box.width * 0.75;
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      const y = Math.max(24, Math.min(box.y + Math.min(box.height * 0.35, 110), viewportHeight - 24));
      const touch = (touchX: number) => ({ id: 1, x: touchX, y, radiusX: 1, radiusY: 1, force: 1 });
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [touch(x)] });
      await page.waitForTimeout(50);
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [touch(x - 40)] });
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [touch(x - 100)] });
      await page.waitForTimeout(50);
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      try {
        await expect(gallery.getByText("3 / 8")).toBeVisible({ timeout: 2500 });
      } catch (error) {
        const state = await page.evaluate(() => ({ viewport: [innerWidth, innerHeight], activeTouches: [...document.querySelectorAll('[aria-live="polite"]')].map((el) => el.textContent), errors: [] }));
        console.log("Touch swipe diagnostic", { project: testInfo.project.name, box, start: { x, y }, state });
        throw error;
      }
      await session.detach();
    }
  }
  await assertNoHorizontalOverflow(page, "/properties/miami/coral-gables-courtyard", testInfo.project.name);
  await page.screenshot({ path: testInfo.outputPath("responsive-property-detail.png"), fullPage: true, caret: "initial" });

  await page.goto("/contact?property=coral-gables-courtyard");
  await expect(page.getByLabel("Interested in")).toHaveValue("Coral Gables Courtyard");
  await expect(page.getByLabel("Phone")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("responsive-contact.png"), fullPage: true, caret: "initial" });
  await assertNoHorizontalOverflow(page, "/contact", testInfo.project.name);
  expect(pageErrors).toEqual([]);
});
