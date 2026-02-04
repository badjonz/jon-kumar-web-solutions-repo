import { test, expect } from '@playwright/test';

test.describe('AboutSection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders 4 trust signal items', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();

    // Check for the 4 trust signal titles
    await expect(aboutSection.locator('text=I Actually Respond')).toBeVisible();
    await expect(aboutSection.locator('text=Results, Not Reports')).toBeVisible();
    await expect(aboutSection.locator('text=You Own Everything')).toBeVisible();
    await expect(aboutSection.locator('text=Built for Speed')).toBeVisible();

    // Count trust signal items (h3 elements within the trust signals area)
    const trustSignalTitles = aboutSection.locator('h3');
    await expect(trustSignalTitles).toHaveCount(4);
  });

  test('displays Lighthouse badge with score 100', async ({ page }) => {
    const aboutSection = page.locator('#about');

    // Find the Lighthouse badge
    const lighthouseBadge = aboutSection.locator('[role="img"][aria-label*="Lighthouse"]');
    await expect(lighthouseBadge).toBeVisible();

    // Check it displays "100"
    await expect(lighthouseBadge.locator('text=100')).toBeVisible();

    // Verify aria-label mentions the score
    const ariaLabel = await lighthouseBadge.getAttribute('aria-label');
    expect(ariaLabel).toContain('100');
    expect(ariaLabel).toContain('Lighthouse');
  });

  test('has proper heading hierarchy with H2 section heading', async ({ page }) => {
    const aboutSection = page.locator('#about');

    // Check for H2 section heading
    const sectionHeading = aboutSection.locator('h2');
    await expect(sectionHeading).toBeVisible();
    await expect(sectionHeading).toHaveText('About');

    // Verify the heading has the correct id for aria-labelledby
    const headingId = await sectionHeading.getAttribute('id');
    expect(headingId).toBe('about-heading');

    // Verify section uses aria-labelledby pointing to the heading
    const labelledBy = await aboutSection.getAttribute('aria-labelledby');
    expect(labelledBy).toBe('about-heading');

    // Verify trust signals use H3 (no skipped levels H2 -> H3)
    const h3Elements = aboutSection.locator('h3');
    const h3Count = await h3Elements.count();
    expect(h3Count).toBe(4); // 4 trust signals with H3 titles
  });
});
