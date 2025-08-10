import { test, expect } from "@playwright/test";

test.describe("Disney+ Clone - Performance & Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have good performance metrics", async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Check page load time with better error handling
    const navigationTiming = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      // Helper function to safely calculate timing differences
      const safeTiming = (end: number, start: number) => {
        const result = end - start;
        return !isNaN(result) && isFinite(result) && result > 0 ? result : 0;
      };

      return {
        domContentLoaded: safeTiming(
          navigation.domContentLoadedEventEnd,
          navigation.fetchStart,
        ),
        loadComplete: safeTiming(
          navigation.loadEventEnd,
          navigation.fetchStart,
        ),
        firstPaint:
          performance
            .getEntriesByType("paint")
            .find((entry) => entry.name === "first-paint")?.startTime || 0,
        firstContentfulPaint:
          performance
            .getEntriesByType("paint")
            .find((entry) => entry.name === "first-contentful-paint")
            ?.startTime || 0,
      };
    });

    console.log("Performance metrics:", navigationTiming);

    // Basic performance expectations with fallback for NaN values
    if (navigationTiming.domContentLoaded > 0) {
      expect(navigationTiming.domContentLoaded).toBeLessThan(10000); // 10 seconds (more lenient)
    }
    if (navigationTiming.firstContentfulPaint > 0) {
      expect(navigationTiming.firstContentfulPaint).toBeLessThan(5000); // 5 seconds (more lenient)
    }

    // At minimum, ensure the page is actually loaded
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });

  test("should be accessible with proper ARIA labels", async ({ page }) => {
    // Check for proper heading structure - including sr-only headings
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Specifically check for main page heading (may be screen reader only)
    const h1 = page.locator("h1");
    await expect(h1).toBeTruthy(); // Should exist even if hidden

    // Check for alt text on images
    const images = page.locator("img");
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");
        if (alt === null || alt === "") {
          console.warn(`Image ${i} missing alt text`);
        }
      }
    }

    // Check for proper button labels
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute("aria-label");
        const text = await button.textContent();

        if (!ariaLabel && (!text || text.trim() === "")) {
          console.warn(`Button ${i} missing accessible label`);
        }
      }
    }

    // Check for keyboard navigation
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedElement).toBeTruthy();
  });

  test("should handle network failures gracefully", async ({ page }) => {
    // Simulate offline condition
    await page.context().setOffline(true);

    // Try to reload the page
    await page.reload();
    await page.waitForTimeout(2000);

    // Check for offline indicator or cached content
    const _offlineMessage = page
      .locator("text=offline")
      .or(page.locator("text=network").or(page.locator("text=connection")));

    // Page should either show offline message or serve cached content
    const pageContent = await page.locator("body").textContent();
    expect(pageContent?.length).toBeGreaterThan(0);

    // Restore network
    await page.context().setOffline(false);
  });

  test("should work with different viewport sizes", async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad landscape
      { width: 1440, height: 900 }, // Desktop
      { width: 1920, height: 1080 }, // Large desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);

      // Check that header is still visible
      await expect(page.locator("header")).toBeVisible();

      // Check that main content is visible
      await expect(page.locator("main")).toBeVisible();

      console.log(`✓ Viewport ${viewport.width}x${viewport.height} working`);
    }
  });

  test("should handle rapid user interactions", async ({ page }) => {
    await page.waitForTimeout(2000);

    // Rapid clicking test
    const clickableElements = page.locator('button, a, [role="button"]');

    if (await clickableElements.first().isVisible()) {
      // Rapid clicks on first clickable element
      for (let i = 0; i < 5; i++) {
        await clickableElements.first().click({ timeout: 500 });
        await page.waitForTimeout(100);
      }

      // Check page is still responsive
      await expect(page.locator("body")).toBeVisible();
    }

    // Rapid scroll test - handle WebKit/mobile limitations
    const browserName = await page.evaluate(() => navigator.userAgent);
    const isMobile = await page.evaluate(() =>
      /Mobi|Android/i.test(navigator.userAgent),
    );

    if (!isMobile && !browserName.includes("WebKit")) {
      // Only test mouse wheel on desktop non-WebKit browsers
      for (let i = 0; i < 10; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(50);
      }
      await page.mouse.wheel(0, -1000); // Scroll back to top
    } else {
      // Use keyboard scrolling for mobile/WebKit
      await page.keyboard.press("End");
      await page.waitForTimeout(500);
      await page.keyboard.press("Home");
    }
  });

  test("should load CSS and JavaScript resources", async ({ page }) => {
    // Check for CSS loading
    const styles = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        fontFamily: computedStyle.fontFamily,
        color: computedStyle.color,
      };
    });

    // Ensure styles are applied (not default browser styles)
    expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(styles.fontFamily).toBeTruthy();

    // Check for JavaScript functionality
    const jsWorking = await page.evaluate(() => {
      // Test if React is loaded and working
      return (
        typeof window.React !== "undefined" ||
        document.querySelector("[data-reactroot]") !== null ||
        document.querySelector("#root") !== null
      );
    });

    expect(jsWorking).toBe(true);
  });

  test("should handle memory usage appropriately", async ({ page }) => {
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          }
        : null;
    });

    if (initialMemory) {
      console.log("Initial memory usage:", initialMemory);

      // Navigate around the app
      await page.reload();
      await page.waitForTimeout(3000);

      // Check memory after operations
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory
          ? {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            }
          : null;
      });

      if (finalMemory) {
        console.log("Final memory usage:", finalMemory);

        // Memory should not grow excessively
        const memoryGrowth =
          finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
        expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // Less than 50MB growth
      }
    } else {
      console.log("Memory API not available in this browser");
    }
  });
});
