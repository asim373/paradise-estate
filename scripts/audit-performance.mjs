import { chromium, devices } from "@playwright/test";

const baseURL = process.env.PERFORMANCE_BASE_URL ?? "http://127.0.0.1:3214";
const routes = ["/", "/properties", "/properties/new-york/the-astor-residence", "/contact"];
const profiles = [
  { name: "desktop", context: { viewport: { width: 1440, height: 900 } } },
  { name: "mobile", context: { ...devices["iPhone 13"] } },
];

const browser = await chromium.launch({ headless: true });

try {
  for (const profile of profiles) {
    for (const route of routes) {
      const context = await browser.newContext(profile.context);
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__paradisePerformance = { cls: 0, lcp: 0, longTasks: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__paradisePerformance.cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__paradisePerformance.lcp = Math.max(window.__paradisePerformance.lcp, entry.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          window.__paradisePerformance.longTasks += list.getEntries().filter((entry) => entry.duration > 50).length;
        }).observe({ type: "longtask", buffered: true });
      });
      const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2_500);
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        const resources = performance.getEntriesByType("resource");
        return {
          ...window.__paradisePerformance,
          domContentLoaded: navigation?.domContentLoadedEventEnd ?? 0,
          load: navigation?.loadEventEnd ?? 0,
          transferBytes: resources.reduce((total, resource) => total + resource.transferSize, 0),
          resourceCount: resources.length,
        };
      });
      console.log(JSON.stringify({ profile: profile.name, route, status: response?.status(), ...metrics }));
      await context.close();
    }
  }
} finally {
  await browser.close();
}
