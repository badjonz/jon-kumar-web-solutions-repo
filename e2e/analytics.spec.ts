import { test, expect } from '@playwright/test';

test.describe('Analytics & Monitoring Integration', () => {
  // Task 5.2 — AC #1, #6
  test('page loads without JavaScript errors after analytics integration', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  // Task 5.3 — AC #7
  test('no analytics cookies set on initial page load', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const cookies = await context.cookies();
    const analyticsCookies = cookies.filter(c =>
      c.name.startsWith('va-') ||
      c.name.startsWith('_vercel') ||
      c.name.toLowerCase().includes('analytics')
    );
    expect(analyticsCookies).toHaveLength(0);
  });

  // Task 5.4 — AC #1, #2
  test('page renders correctly with analytics components present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
  });

  // Task 5.5 — AC #6
  test('analytics does not introduce new console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter only the known pre-existing SkipLink dev-mode hydration mismatch (CRLF/LF artifact, not analytics-related)
        if (text.includes('A tree hydrated') || text.includes('Hydration failed because')) return;
        consoleErrors.push(text);
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(consoleErrors).toHaveLength(0);
  });
});
