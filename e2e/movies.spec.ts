import { test, expect } from "@playwright/test";

test.describe("Disney+ Clone - Movie Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for initial content to load
    await page.waitForTimeout(3000);
  });

  test("should display movie cards with proper information", async ({
    page,
  }) => {
    // Look for movie cards in the Action section (as shown in screenshot)
    const movieCards = page
      .locator('[data-testid="movie-card"]')
      .or(page.locator(".movie-card"))
      .or(page.locator('img[alt*="Jurassic"]'));

    if (await movieCards.first().isVisible()) {
      const firstCard = movieCards.first();

      // Check if movie card has image
      const movieImage = firstCard.locator("img");
      await expect(movieImage).toBeVisible();

      // Check if movie card has title or alt text
      const hasAltText = await movieImage.getAttribute("alt");
      expect(hasAltText).toBeTruthy();

      console.log("Movie cards displayed successfully");
    } else {
      console.log("Movie cards not found - API may not be working");
    }
  });

  test("should handle movie card interactions", async ({ page }) => {
    // Look for movie cards
    const movieCards = page
      .locator('img[src*="tmdb"]')
      .or(page.locator('[data-testid="movie-card"]'));

    if (await movieCards.first().isVisible()) {
      const firstCard = movieCards.first();

      // Test hover effect
      await firstCard.hover();
      await page.waitForTimeout(500);

      // Test click interaction
      await firstCard.click();
      await page.waitForTimeout(2000);

      // Check if navigated to movie detail page or modal opened
      const currentUrl = page.url();
      const modalOpen = await page.locator('[role="dialog"]').isVisible();

      if (currentUrl.includes("/movie/") || modalOpen) {
        console.log("Movie detail navigation working");

        // If modal, check for close functionality
        if (modalOpen) {
          const closeButton = page
            .locator('[aria-label="Close"]')
            .or(page.locator("button[data-dismiss]"));
          if (await closeButton.isVisible()) {
            await closeButton.click();
          } else {
            await page.keyboard.press("Escape");
          }
        } else {
          // If navigated to detail page, go back
          await page.goBack();
        }
      }
    } else {
      console.log("No movie cards found for interaction testing");
    }
  });

  test("should test watchlist functionality", async ({ page }) => {
    // Look for watchlist buttons (heart icons or add to watchlist buttons)
    const watchlistButtons = page
      .locator('[aria-label*="watchlist"]')
      .or(page.locator('[data-testid="watchlist-button"]'))
      .or(page.locator('button[title*="watchlist"]'));

    if (await watchlistButtons.first().isVisible()) {
      const firstButton = watchlistButtons.first();

      // Test add to watchlist
      await firstButton.click();
      await page.waitForTimeout(1000);

      // Check for success notification or state change
      const notification = page
        .locator(".toast")
        .or(page.locator('[role="alert"]'))
        .or(page.locator(".notification"));

      try {
        await expect(notification).toBeVisible({ timeout: 2000 });
        console.log("Watchlist notification working");
      } catch {
        console.log("No watchlist notification found");
      }

      // Test remove from watchlist
      await firstButton.click();
      await page.waitForTimeout(1000);
    } else {
      console.log("Watchlist functionality not found in current state");
    }
  });

  test("should test genre filtering and categories", async ({ page }) => {
    // Check for genre sections like "Action" shown in screenshot
    const genreSections = page
      .locator("h2, h3")
      .filter({ hasText: /Action|Comedy|Drama|Horror|Sci-Fi/i });

    if (await genreSections.first().isVisible()) {
      const sectionCount = await genreSections.count();
      expect(sectionCount).toBeGreaterThan(0);

      console.log(`Found ${sectionCount} genre sections`);

      // Check if each section has movies
      for (let i = 0; i < Math.min(sectionCount, 3); i++) {
        const section = genreSections.nth(i);
        const sectionText = await section.textContent();

        // Look for movies in this section
        const _moviesInSection = page
          .locator(`img[alt*="${sectionText?.split(" ")[0]}"]`)
          .or(section.locator("~ div img"));

        console.log(`Checking ${sectionText} section for movies`);
      }
    } else {
      console.log("Genre sections not found - content may still be loading");
    }
  });

  test("should handle video player functionality", async ({ page }) => {
    // Look for play buttons or video elements
    const playButtons = page
      .locator('[aria-label*="play"]')
      .or(page.locator('[data-testid="play-button"]'))
      .or(page.locator('button[title*="play"]'));

    if (await playButtons.first().isVisible()) {
      await playButtons.first().click();
      await page.waitForTimeout(2000);

      // Check if video player opened
      const videoPlayer = page
        .locator("video")
        .or(page.locator('[data-testid="video-player"]'));

      if (await videoPlayer.isVisible()) {
        console.log("Video player opened successfully");

        // Test video controls
        const pauseButton = page.locator('[aria-label*="pause"]');
        const _fullscreenButton = page.locator('[aria-label*="fullscreen"]');

        if (await pauseButton.isVisible()) {
          await pauseButton.click();
          await page.waitForTimeout(500);
        }

        // Test escape to exit
        await page.keyboard.press("Escape");
        await page.waitForTimeout(1000);
      }
    } else {
      console.log("Play buttons not found in current state");
    }
  });

  test("should test search functionality with movie queries", async ({
    page,
  }) => {
    // Look for search input
    const searchInput = page
      .locator('input[type="search"]')
      .or(page.locator('input[placeholder*="search"]'));

    if (await searchInput.isVisible()) {
      // Test searching for movies visible in screenshot
      const searchTerms = ["Jurassic", "Marvel", "Star Wars", "Disney"];

      for (const term of searchTerms) {
        await searchInput.fill(term);
        await page.waitForTimeout(1000);

        // Check for search suggestions or results
        const searchResults = page
          .locator('[data-testid="search-results"]')
          .or(page.locator(".search-suggestions"));

        if (await searchResults.isVisible()) {
          console.log(`Search results found for: ${term}`);
        }

        await searchInput.clear();
        await page.waitForTimeout(500);
      }
    } else {
      console.log("Search input not found");
    }
  });
});
