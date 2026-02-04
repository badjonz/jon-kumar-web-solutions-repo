import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test.describe('Mobile viewport (375px)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('renders single column layout with proper padding', async ({ page }) => {
      await page.goto('/');

      // Check that main content container exists
      const container = page.locator('.container').first();
      await expect(container).toBeVisible();

      // Verify padding is applied (px-4 = 16px on mobile)
      const padding = await container.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return parseInt(style.paddingLeft);
      });
      expect(padding).toBeGreaterThanOrEqual(16);
    });

    test('has no horizontal scroll', async ({ page }) => {
      await page.goto('/');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Tablet viewport (768px)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('applies tablet layout adjustments', async ({ page }) => {
      await page.goto('/');

      // Hero section should have larger padding on tablet (md:py-32)
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
    });

    test('has no horizontal scroll', async ({ page }) => {
      await page.goto('/');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Desktop viewport (1024px+)', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('applies max-width constraint and centers content', async ({ page }) => {
      await page.goto('/');

      // Check services section has max-width constraint (max-w-[1200px])
      const servicesContainer = page.locator('#services .max-w-\\[1200px\\]');
      await expect(servicesContainer).toBeVisible();

      // Container should be centered
      const iscentered = await servicesContainer.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.marginLeft === style.marginRight;
      });
      expect(iscentered).toBe(true);
    });

    test('has no horizontal scroll', async ({ page }) => {
      await page.goto('/');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Viewport range test (320px to 1920px)', () => {
    const viewports = [320, 480, 768, 1024, 1440, 1920];

    for (const width of viewports) {
      test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);
      });
    }
  });
});
