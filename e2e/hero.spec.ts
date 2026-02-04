import { test, expect } from '@playwright/test';

test.describe('HeroSection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero with headline, subtext, and CTAs', async ({ page }) => {
    // Check headline
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Modern Web Solutions');
    await expect(headline).toContainText('Expertly Delivered');

    // Check subtext
    const subtext = page.locator('p').filter({ hasText: 'From sleek designs to robust back-end systems' });
    await expect(subtext).toBeVisible();

    // Check CTAs exist
    const letsTalkButton = page.locator('a[href="#contact"]', { hasText: "Let's Talk" });
    await expect(letsTalkButton).toBeVisible();

    const seeServicesButton = page.locator('a[href="#services"]', { hasText: 'See Services' });
    await expect(seeServicesButton).toBeVisible();
  });

  test('"Let\'s Talk" button has correct href to #contact', async ({ page }) => {
    const letsTalkButton = page.locator('a[href="#contact"]');
    await expect(letsTalkButton).toBeVisible();

    // Verify the href attribute points to #contact
    const href = await letsTalkButton.getAttribute('href');
    expect(href).toBe('#contact');

    // Note: Actual scroll behavior will be testable once ContactSection is implemented
  });

  test('"See Services" button scrolls to #services', async ({ page }) => {
    const seeServicesButton = page.locator('a[href="#services"]');
    await expect(seeServicesButton).toBeVisible();

    // Get initial scroll position
    const initialY = await page.evaluate(() => window.scrollY);

    // Click the button
    await seeServicesButton.click();

    // Wait for scroll animation
    await page.waitForTimeout(600);

    // Verify services section is now visible near viewport top
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    const servicesRect = await servicesSection.evaluate((el) => el.getBoundingClientRect().top);
    expect(servicesRect).toBeLessThan(100); // Services section near top of viewport
  });

  test('respects reduced motion preference', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // The hero section should still render correctly
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();

    // With reduced motion, animations should be instant (duration: 0)
    // We verify the content is visible immediately without animation delays
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Check that opacity is 1 (fully visible, not mid-animation)
    const opacity = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(opacity).toBe('1');
  });
});
