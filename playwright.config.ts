import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3214";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: "functional-chromium",
      testMatch: "**/functional.spec.ts",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "accessibility-desktop",
      testMatch: "**/accessibility.spec.ts",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "accessibility-mobile",
      testMatch: "**/accessibility.spec.ts",
      use: { ...devices["iPhone 13"], browserName: "chromium", viewport: { width: 375, height: 812 } },
    },
    ...[
      ["desktop-1920", 1920, 1080],
      ["desktop-1440", 1440, 900],
      ["desktop-1366", 1366, 768],
    ].map(([name, width, height]) => ({
      name: String(name),
      testMatch: "**/desktop.spec.ts",
      use: { ...devices["Desktop Chrome"], viewport: { width: Number(width), height: Number(height) } },
    })),
    ...[
      ["ipad-portrait", "iPad (gen 7)", 768, 1024],
      ["ipad-pro-portrait", "iPad (gen 7)", 1032, 1376],
      ["ipad-landscape", "iPad (gen 7)", 1024, 768],
      ["ipad-pro-landscape", "iPad (gen 7)", 1376, 1032],
      ["android-tablet-portrait", "Galaxy Tab S4", 800, 1280],
      ["android-tablet-landscape", "Galaxy Tab S4", 1280, 800],
      ["iphone-portrait", "iPhone 13", 375, 812],
      ["iphone-landscape", "iPhone 13", 844, 390],
      ["android-phone-portrait", "Pixel 7", 412, 915],
      ["android-phone-landscape", "Pixel 7", 915, 412],
    ].map(([name, device, width, height]) => ({
      name: String(name),
      testMatch: "**/responsive.spec.ts",
      use: {
        ...devices[String(device)],
        browserName: "chromium" as const,
        viewport: { width: Number(width), height: Number(height) },
      },
    })),
  ],
  webServer: {
    command: "npm.cmd run build && npm.cmd run start -- --hostname 127.0.0.1 --port 3214",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
