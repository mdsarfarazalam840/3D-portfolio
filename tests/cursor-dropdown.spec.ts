import { test, expect } from "@playwright/test";

test("custom cursor z-index is above bg-switcher dropdown", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("body.custom-cursor-enabled");

  // Open the bg-switcher dropdown
  await page.click(".bg-switcher__trigger");
  await expect(page.locator(".bg-switcher__dropdown--portaled")).toBeVisible();

  // Hover over the first dropdown option
  const option = page.locator(".bg-switcher__option").first();
  await option.hover();

  // Check that cursor-ring z-index is > 100 (above dropdown's z-index: 100)
  const cursorZIndex = await page.locator(".cursor-ring").evaluate(
    (el) => parseInt(getComputedStyle(el).zIndex, 10),
  );
  expect(cursorZIndex).toBeGreaterThan(100);

  // Check that cursor-dot z-index is also > 100
  const dotZIndex = await page.locator(".cursor-dot").evaluate(
    (el) => parseInt(getComputedStyle(el).zIndex, 10),
  );
  expect(dotZIndex).toBeGreaterThan(100);

  // Verify dropdown z-index is 100 (unchanged)
  const dropdownZIndex = await page.locator(".bg-switcher__dropdown--portaled").evaluate(
    (el) => parseInt(getComputedStyle(el).zIndex, 10),
  );
  expect(dropdownZIndex).toBe(100);
});
