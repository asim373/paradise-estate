import { expect, test } from "@playwright/test";

const properties = [
  ["new-york", "the-astor-residence", "The Astor Residence"],
  ["new-york", "park-avenue-penthouse", "Park Avenue Penthouse"],
  ["miami", "palmetto-house", "Palmetto House"],
  ["miami", "coral-gables-courtyard", "Coral Gables Courtyard"],
  ["los-angeles", "canyon-view-estate", "Canyon View Estate"],
  ["los-angeles", "silver-lake-modern", "Silver Lake Modern"],
  ["chicago", "lakeview-greystone", "Lakeview Greystone"],
  ["chicago", "the-magnificent-mile-residence", "The Magnificent Mile Residence"],
] as const;

const topLevelPages = [
  ["/", "Paradise Estate"],
  ["/properties", "Properties | Paradise Estate"],
  ["/about", "About Us | Paradise Estate"],
  ["/communities", "Communities | Paradise Estate"],
  ["/contact", "Contact | Paradise Estate"],
] as const;

test("all implemented top-level pages render", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const [path, title] of topLevelPages) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page).toHaveTitle(title);
  }
  expect(pageErrors).toEqual([]);
});

test("all city pages isolate their two listings", async ({ page }) => {
  for (const city of ["new-york", "miami", "los-angeles", "chicago"]) {
    const response = await page.goto(`/properties/${city}`);
    expect(response?.status(), city).toBe(200);
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(2);
    const expectedNames = city === "new-york" ? ["The Astor Residence", "Park Avenue Penthouse"] : city === "miami" ? ["Palmetto House", "Coral Gables Courtyard"] : city === "los-angeles" ? ["Canyon View Estate", "Silver Lake Modern"] : ["Lakeview Greystone", "The Magnificent Mile Residence"];
    for (const name of expectedNames) await expect(cards.filter({ hasText: name })).toHaveCount(1);
  }
});

test("all eight details render their own data and navigate the complete gallery", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  for (const [city, slug, name] of properties) {
    const response = await page.goto(`/properties/${city}/${slug}`);
    expect(response?.status(), name).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
    await expect(page.getByText(/\d+ beds/)).toBeVisible();
    const gallery = page.getByLabel(`${name} image gallery`);
    const image = gallery.locator("img");
    await expect(image).toHaveCount(1);
    await expect(image).toHaveAttribute("alt", /.+/);
    await expect(gallery.getByText("1 / 8")).toBeVisible();
    for (let index = 2; index <= 8; index += 1) {
      await gallery.getByRole("button", { name: `Next image in ${name} gallery` }).click();
      await expect(gallery.getByText(`${index} / 8`)).toBeVisible();
      await expect(image).toHaveAttribute("alt", /.+/);
    }
    await gallery.getByRole("button", { name: `Next image in ${name} gallery` }).click();
    await expect(gallery.getByText("1 / 8")).toBeVisible();
    await gallery.getByRole("button", { name: `Previous image in ${name} gallery` }).click();
    await expect(gallery.getByText("8 / 8")).toBeVisible();
    await expect(page.getByRole("link", { name: /Schedule a viewing/i })).toHaveAttribute("href", `/contact?property=${slug}`);
  }
  expect(pageErrors).toEqual([]);
});

test("invalid detail routes and city/slug mismatches return the 404 page", async ({ page }) => {
  for (const path of ["/properties/no-such-city/no-such-property", "/properties/new-york/palmetto-house"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { name: "This address is not on our map." })).toBeVisible();
  }
});

test("desktop navigation, city dropdown, and footer links work", async ({ page }) => {
  await page.goto("/");
  const desktopNav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(desktopNav.getByRole("link", { name: "About Us" })).toBeVisible();
  await desktopNav.getByRole("button", { name: "Properties" }).click();
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem")).toHaveCount(5);
  await menu.getByRole("menuitem", { name: "Miami" }).click();
  await expect(page).toHaveURL(/\/properties\/miami$/, { timeout: 30_000 });
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/127\.0\.0\.1:3214\/$/);
});

test("filter controls handle URL state, search, combined filtering, empty results, and reset", async ({ page }) => {
  await page.goto("/properties?city=miami&type=Villa");
  await expect(page.getByLabel("City")).toHaveValue("miami");
  await expect(page.getByLabel("Property type")).toHaveValue("Villa");
  await expect(page.getByText(/Showing\s+1\s+of\s+8\s+residences/)).toBeVisible();

  await page.getByLabel("City").selectOption("all");
  await page.getByLabel("Property type").selectOption("all");
  await page.getByLabel("Keyword search").fill("skyline");
  await expect(page.getByText(/Showing\s+1\s+of\s+8\s+residences/)).toBeVisible();
  await expect(page.locator("main article")).toContainText("Canyon View Estate");

  await page.getByLabel("Keyword search").fill("no-matching-residence-phrase");
  await expect(page.getByText("Nothing matches this edit.")).toBeVisible();
  await page.locator(".filter-panel").getByRole("button", { name: "Reset filters" }).click();
  await expect(page).toHaveURL(/\/properties$/);
  await expect(page.getByText(/Showing\s+8\s+of\s+8\s+residences/)).toBeVisible();
});

test("home search submits selected criteria to the Properties URL", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("City").selectOption("new-york");
  await page.getByLabel("Keyword search").fill("brownstone");
  await page.getByRole("button", { name: /Explore selection/i }).click();
  await expect(page).toHaveURL(/\/properties\?city=new-york&q=brownstone$/);
  await expect(page.getByLabel("City")).toHaveValue("new-york");
});

test("Schedule a Viewing preselects the property on Contact", async ({ page }) => {
  await page.goto("/properties/miami/coral-gables-courtyard");
  await page.getByRole("link", { name: /Schedule a viewing/i }).click();
  await expect(page).toHaveURL(/\/contact\?property=coral-gables-courtyard$/);
  await expect(page.getByLabel("Interested in")).toHaveValue("Coral Gables Courtyard");
});

test("contact validation and success UI use an intercepted request only", async ({ page }) => {
  let posts = 0;
  await page.route("**/api/inquiries", async (route) => {
    if (route.request().method() === "POST") {
      posts += 1;
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { accepted: true } }) });
    } else {
      await route.continue();
    }
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByLabel("Name")).toHaveJSProperty("validity.valid", false);
  expect(posts).toBe(0);

  await page.getByLabel("Name").fill("QA Visitor");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Message").fill("A sufficiently long test inquiry message.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByLabel("Email")).toHaveJSProperty("validity.valid", false);
  expect(posts).toBe(0);

  await page.getByLabel("Email").fill("qa@example.test");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByRole("heading", { name: "Inquiry received" })).toBeVisible();
  await expect(page.getByText("Thank you for reaching out. Your inquiry has been successfully submitted.")).toBeVisible();
  expect(posts).toBe(1);
});

test("inquiry failure is visible and retry retains the same idempotency key", async ({ page }) => {
  const keys: string[] = [];
  let attempt = 0;
  await page.route("**/api/inquiries", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    keys.push(route.request().headers()["idempotency-key"]);
    attempt += 1;
    if (attempt === 1) return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: { message: "Temporary test failure" } }) });
    return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { accepted: true } }) });
  });
  await page.goto("/contact");
  await page.getByLabel("Name").fill("QA Visitor");
  await page.getByLabel("Email").fill("qa@example.test");
  await page.getByLabel("Message").fill("A sufficiently long test inquiry message.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.locator('p[role="alert"]')).toContainText("Temporary test failure");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByRole("heading", { name: "Inquiry received" })).toBeVisible();
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBeTruthy();
  expect(keys[1]).toBe(keys[0]);
});

test("inquiry submit disables while pending and accepts only one intercepted request", async ({ page }) => {
  let releaseResponse: (() => void) | undefined;
  let posts = 0;
  await page.route("**/api/inquiries", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    posts += 1;
    await new Promise<void>((resolve) => { releaseResponse = resolve; });
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { accepted: true } }) });
  });

  await page.goto("/contact");
  await page.getByLabel("Name").fill("QA Visitor");
  await page.getByLabel("Email").fill("qa@example.test");
  await page.getByLabel("Message").fill("A sufficiently long test inquiry message.");
  const submit = page.getByRole("button", { name: "Send inquiry" });
  await submit.click();
  await expect(page.getByRole("button", { name: /Sending/i })).toBeDisabled();
  expect(posts).toBe(1);
  releaseResponse?.();
  await expect(page.getByRole("heading", { name: "Inquiry received" })).toBeVisible();
  expect(posts).toBe(1);
});

test("property specifications render with labeled values", async ({ page }, testInfo) => {
  await page.goto("/properties/new-york/the-astor-residence");
  await expect(page.getByRole("heading", { name: "Considered in every detail." })).toBeVisible();
  await expect(page.getByText("Architecture & finishes")).toBeVisible();
  await expect(page.getByText("Outdoor spaces")).toBeVisible();
  await expect(page.getByText("Amenities & facilities")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("astor-property-desktop.png"), fullPage: true, caret: "initial" });
});
