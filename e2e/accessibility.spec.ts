import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/properties",
  "/properties/new-york",
  "/properties/new-york/the-astor-residence",
  "/about",
  "/communities",
  "/contact",
] as const;

test("public routes have no serious or critical automated accessibility violations", async ({ page }) => {
  for (const path of routes) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    expect(seriousOrCritical, `${path}: ${seriousOrCritical.map((violation) => violation.id).join(", ")}`).toEqual([]);
  }
});
