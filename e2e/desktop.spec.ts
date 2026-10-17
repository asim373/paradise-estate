import { expect, test } from "@playwright/test";

test("desktop viewport has no horizontal overflow and primary content is visible", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/", "/properties", "/properties/new-york/the-astor-residence", "/contact"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow, `${path} should not overflow at ${testInfo.project.name}`).toBe(false);
    await page.screenshot({ path: testInfo.outputPath(`${path === "/" ? "home" : path.slice(1).replaceAll("/", "-")}.png`), fullPage: true, caret: "initial" });
  }
  expect(errors).toEqual([]);
});
