import { test, expect } from "@playwright/test";

test("navbar hides on scroll down and reappears on scroll up", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".site-header");

  // Helper: check if header is off-screen (above viewport) via bounding rect
  const isHidden = async () => {
    const rect = await page.locator(".site-header").evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom };
    });
    return rect.bottom <= 0;
  };

  // Initially visible at top of page
  expect(await isHidden()).toBe(false);

  // Scroll down past 80px threshold
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await page.waitForTimeout(1000);

  // Header should be hidden (negative translateY)
  expect(await isHidden()).toBe(true);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);

  // Header should be visible again (no transform or identity)
  expect(await isHidden()).toBe(false);
});

test("navbar has scrolled class when past threshold", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".site-header");

  // At top of page — no scrolled class
  await expect(page.locator(".site-header")).not.toHaveClass(/site-header--scrolled/);

  // Scroll past 80px
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await page.waitForTimeout(300);

  // Should have scrolled class
  await expect(page.locator(".site-header")).toHaveClass(/site-header--scrolled/);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);

  // Scrolled class should be removed
  await expect(page.locator(".site-header")).not.toHaveClass(/site-header--scrolled/);
});

test("navbar is position fixed", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".site-header");

  const position = await page.locator(".site-header").evaluate(
    (el) => getComputedStyle(el).position,
  );
  expect(position).toBe("fixed");
});
