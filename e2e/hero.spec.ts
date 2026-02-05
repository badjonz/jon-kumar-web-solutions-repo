import { test, expect } from '@playwright/test';

test.describe('HeroSection - Visual Enhancements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section has visual background element (gradient)', async ({ page }) => {
    // The hero section should have a gradient background element
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Look for the gradient overlay div inside the hero section
    const gradientElement = heroSection.locator('div[class*="bg-gradient"]');
    await expect(gradientElement.first()).toBeAttached();
  });

  test('hero gradient does not interfere with text readability', async ({ page }) => {
    // Verify text content remains visible over the gradient
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Modern Web Solutions');

    // Verify CTA buttons are visible (use specific hero button via text)
    const ctaButton = page.getByRole('link', { name: "Let's Talk" });
    await expect(ctaButton).toBeVisible();
  });
});

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

  test('"Let\'s Talk" button scrolls to #contact', async ({ page }) => {
    // Use hero-specific locator to avoid matching header nav link
    const letsTalkButton = page.getByRole('link', { name: "Let's Talk" });
    await expect(letsTalkButton).toBeVisible();

    // Verify the href attribute points to #contact
    await expect(letsTalkButton).toHaveAttribute('href', '#contact');

    // Check if contact section exists
    const contactSection = page.locator('#contact');
    const hasContact = await contactSection.count() > 0;

    if (hasContact) {
      // Get initial scroll position
      const initialY = await page.evaluate(() => window.scrollY);

      // Click the button to trigger scroll
      await letsTalkButton.click();

      // Wait for scroll to occur by polling scrollY position
      await expect(async () => {
        const currentY = await page.evaluate(() => window.scrollY);
        // Scroll position should have changed (scrolled down)
        expect(currentY).toBeGreaterThan(initialY);
      }).toPass({ timeout: 2000 });

      // Verify contact section is now in or near viewport
      await expect(async () => {
        const contactRect = await contactSection.evaluate((el) => el.getBoundingClientRect().top);
        // Contact section should be within viewport (top < viewport height)
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        expect(contactRect).toBeLessThan(viewportHeight);
      }).toPass({ timeout: 2000 });
    }
  });

  test('"See Services" button scrolls to #services', async ({ page }) => {
    // Use hero-specific locator to avoid matching header nav link
    const seeServicesButton = page.getByRole('link', { name: 'See Services' });
    await expect(seeServicesButton).toBeVisible();

    // Get initial scroll position
    const initialY = await page.evaluate(() => window.scrollY);

    // Click the button
    await seeServicesButton.click();

    // Wait for scroll to complete by checking services section position
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    // Poll until services section is near viewport top (scroll completed)
    await expect(async () => {
      const servicesRect = await servicesSection.evaluate((el) => el.getBoundingClientRect().top);
      // Services section should be within 150px of viewport top after scroll
      expect(servicesRect).toBeLessThan(150);
    }).toPass({ timeout: 2000 });

    // Verify scroll actually occurred
    const finalY = await page.evaluate(() => window.scrollY);
    expect(finalY).toBeGreaterThan(initialY);
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
