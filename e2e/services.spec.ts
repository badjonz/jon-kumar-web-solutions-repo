import { test, expect } from '@playwright/test';

test.describe('ServicesSection - Icons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('each service card displays an icon', async ({ page }) => {
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    const cards = servicesSection.locator('[data-testid="service-card"]');
    await expect(cards).toHaveCount(3);

    // Each card should have an SVG icon
    for (const card of await cards.all()) {
      const icon = card.locator('svg');
      await expect(icon).toBeVisible();
    }
  });

  test('service icons have aria-hidden for accessibility', async ({ page }) => {
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    // All service icons should have aria-hidden="true" since they are decorative
    const icons = page.locator('#services svg[aria-hidden="true"]');
    await expect(icons).toHaveCount(3);
  });

  test('icons use orange accent color', async ({ page }) => {
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    const cards = servicesSection.locator('[data-testid="service-card"]');
    for (const card of await cards.all()) {
      const iconContainer = card.locator('svg').first();
      await expect(iconContainer).toBeVisible();

      // Verify parent container has text-orange-500 class (which provides #f97316)
      const parentDiv = card.locator('div[aria-hidden="true"]').first();
      await expect(parentDiv).toHaveClass(/text-orange-500/);
    }
  });
});

test.describe('ServicesSection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders 3 service cards with correct titles and descriptions', async ({ page }) => {
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    // Check for the 3 service cards (use data-slot="card" for top-level cards only)
    const cards = servicesSection.locator('[data-testid="service-card"]');
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

  test('staggered animation respects reduced motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // With reduced motion, all content should be immediately visible
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    // All cards should be fully visible immediately (opacity: 1)
    const cards = servicesSection.locator('[data-testid="service-card"]');
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      await expect(async () => {
        const opacity = await card.evaluate((el) => {
          // Get the parent motion.div wrapper's opacity
          const parent = el.parentElement;
          return parent ? window.getComputedStyle(parent).opacity : '1';
        });
        expect(opacity).toBe('1');
      }).toPass({ timeout: 1000 });
    }
  });

  // Only run hover test on desktop (hover doesn't work reliably on mobile touch devices)
  test('cards have hover states', async ({ page, isMobile }) => {
    // Skip hover test on mobile devices as they don't support hover
    test.skip(isMobile === true, 'Hover states are not applicable on mobile devices');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const firstCard = page.locator('#services [data-testid="service-card"]').first();
    await expect(firstCard).toBeVisible();

    // Get initial computed styles before hover
    const initialStyles = await firstCard.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        boxShadow: style.boxShadow,
        borderColor: style.borderColor,
      };
    });

    // Hover over the card
    await firstCard.hover();

    // Wait for CSS transition to complete by polling for style change
    await expect(async () => {
      const hoverStyles = await firstCard.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          boxShadow: style.boxShadow,
          borderColor: style.borderColor,
        };
      });

      // Check if either box-shadow or border-color changed on hover
      const shadowChanged = hoverStyles.boxShadow !== initialStyles.boxShadow;
      const borderChanged = hoverStyles.borderColor !== initialStyles.borderColor;

      expect(shadowChanged || borderChanged).toBe(true);
    }).toPass({ timeout: 1000 });
  });
});
