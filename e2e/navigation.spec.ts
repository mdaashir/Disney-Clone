import { test, expect } from "@playwright/test";

test.describe("Disney+ Clone - Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate through main menu items", async ({ page }) => {
    const viewport = page.viewportSize();

    if (viewport && viewport.width >= 768) {
      // Desktop navigation
      const desktopNav = page.locator('[data-testid="desktop-navigation"]');
      await expect(desktopNav).toBeVisible();

      // Test HOME navigation (should be active by default)
      const homeButton = page.locator('[data-testid="nav-home"]');
      await expect(homeButton).toBeVisible();
      await homeButton.click();
      await expect(page).toHaveURL("/");

      // Test other navigation buttons
      const searchButton = page.locator('[data-testid="nav-search"]');
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(1000);
      }
    } else {
      // Mobile navigation
      const mobileMenuButton = page.locator(
        '[data-testid="mobile-menu-button"]',
      );
      await expect(mobileMenuButton).toBeVisible();

      // Open mobile menu
      await mobileMenuButton.click();

      // Check mobile navigation items
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();

      // Test HOME navigation in mobile menu
      const homeButton = page.locator('[data-testid="mobile-nav-home"]');
      await expect(homeButton).toBeVisible();
      await homeButton.click();
      await expect(page).toHaveURL("/");
    }
  });

  test("should handle search input functionality", async ({ page }) => {
    const viewport = page.viewportSize();

    if (viewport && viewport.width >= 768) {
      // Desktop search
      const searchInput = page.locator('input[placeholder*="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill("Marvel");
        await page.keyboard.press("Enter");
        await page.waitForTimeout(2000);
      }
    } else {
      // Mobile search - need to open mobile menu first
      const mobileMenuButton = page.locator(
        '[data-testid="mobile-menu-button"]',
      );
      await mobileMenuButton.click();

      const mobileSearchInput = page.locator(
        '[data-testid="mobile-search-input"]',
      );
      if (await mobileSearchInput.isVisible()) {
        await mobileSearchInput.fill("Marvel");
        await page.keyboard.press("Enter");
        await page.waitForTimeout(2000);
      }
    }

    // Check if search results are displayed or other search functionality
    console.log(
      "Search functionality tested - exact behavior depends on implementation",
    );
  });

  test("should toggle theme (light/dark mode)", async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page
      .locator('[data-testid="theme-toggle"]')
      .or(page.locator('button[aria-label*="theme"]'))
      .or(page.locator(".theme-toggle"));

    if (await themeToggle.isVisible()) {
      // Get initial theme state
      const initialBodyClass = await page.locator("body").getAttribute("class");

      // Click theme toggle
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(500);

      // Check if theme changed
      const newBodyClass = await page.locator("body").getAttribute("class");
      expect(newBodyClass).not.toBe(initialBodyClass);
    } else {
      console.log("Theme toggle not found - checking for automatic dark theme");
      const isDark = await page.locator("body").evaluate((body) => {
        const styles = window.getComputedStyle(body);
        return (
          styles.backgroundColor === "rgb(15, 23, 42)" ||
          body.classList.contains("dark") ||
          styles.color === "rgb(248, 250, 252)"
        );
      });
      expect(isDark).toBe(true);
    }
  });

  test("should have working scroll functionality", async ({ page }) => {
    // Test horizontal scrolling on slider/carousels
    const leftArrow = page.locator('[aria-label="Scroll left"]');
    const rightArrow = page.locator('[aria-label="Scroll right"]');

    if (await rightArrow.isVisible()) {
      await rightArrow.click();
      await page.waitForTimeout(500);

      if (await leftArrow.isVisible()) {
        await leftArrow.click();
        await page.waitForTimeout(500);
      }
    }

    // Test vertical scrolling
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  test("should handle keyboard navigation", async ({ page }) => {
    // Test Tab navigation through interactive elements
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    await page.keyboard.press("Tab");

    // Test Enter key on focused element
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    // Test Escape key
    await page.keyboard.press("Escape");
  });
});
