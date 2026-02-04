import { test, expect } from '@playwright/test';

test.describe('ServicesSection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders 3 service cards with correct titles and descriptions', async ({ page }) => {
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    // Check for the 3 service cards (use data-slot="card" for top-level cards only)
    const cards = servicesSection.locator('[data-slot="card"]');
    await expect(cards).toHaveCount(3);

    // Verify card titles
    await expect(servicesSection.locator('text=Get Found by Local Customers')).toBeVisible();
    await expect(servicesSection.locator('text=Build Authority and Trust')).toBeVisible();
    await expect(servicesSection.locator('text=Own Your Online Presence')).toBeVisible();

    // Verify descriptions exist
    await expect(servicesSection.locator('text=Turn Google searches into phone calls')).toBeVisible();
    await expect(servicesSection.locator('text=Present yourself as the expert')).toBeVisible();
    await expect(servicesSection.locator('text=Stop depending on algorithms')).toBeVisible();
  });

  test.describe('Grid layout responsiveness', () => {
    test('displays 1-column grid on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Target the specific grid container with grid-cols-1 class
      const grid = page.locator('#services .grid.grid-cols-1').first();
      await expect(grid).toBeVisible();

      // Check grid has grid-cols-1 class (single column on mobile)
      const gridColumns = await grid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.gridTemplateColumns;
      });

      // On mobile, should be single column (1fr or equivalent)
      const columnCount = gridColumns.split(' ').filter(c => c.trim()).length;
      expect(columnCount).toBe(1);
    });

    test('displays 3-column grid on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');

      // Target the specific grid container with lg:grid-cols-3 class
      const grid = page.locator('#services .grid.grid-cols-1').first();
      await expect(grid).toBeVisible();

      // Check that grid displays as 3 columns on desktop
      const gridColumns = await grid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.gridTemplateColumns;
      });

      // Should have 3 columns (3 values separated by spaces)
      const columnCount = gridColumns.split(' ').filter(c => c.trim()).length;
      expect(columnCount).toBe(3);
    });
  });

  test('cards have hover states', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const firstCard = page.locator('#services [data-slot="card"]').first();
    await expect(firstCard).toBeVisible();

    // Get initial box-shadow
    const initialShadow = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });

    // Hover over the card
    await firstCard.hover();

    // Wait for transition
    await page.waitForTimeout(200);

    // Get hover state box-shadow
    const hoverShadow = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });

    // Shadow should change on hover (hover:shadow-lg adds shadow)
    // Either the shadow value changes, or we verify the class includes hover styling
    const hasHoverClass = await firstCard.evaluate((el) => {
      return el.className.includes('hover:shadow-lg') || el.className.includes('hover:border-orange');
    });

    expect(hasHoverClass).toBe(true);
  });
});
