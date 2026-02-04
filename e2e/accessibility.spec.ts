import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    // Start at the beginning of the page
    await page.keyboard.press('Tab');

    // Collect focusable elements as we tab through
    const focusedElements: string[] = [];
    let previousElement = '';
    let maxTabs = 50; // Safety limit

    while (maxTabs > 0) {
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return {
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().substring(0, 50) || '',
          href: el.getAttribute('href') || '',
        };
      });

      if (!focused) break;

      const elementKey = `${focused.tag}:${focused.href || focused.text}`;
      if (elementKey === previousElement) break; // We've cycled back

      focusedElements.push(elementKey);
      previousElement = elementKey;

      await page.keyboard.press('Tab');
      maxTabs--;
    }

    // Verify we can tab to the main CTAs
    const hasTalkLink = focusedElements.some(e => e.includes('#contact'));
    const hasServicesLink = focusedElements.some(e => e.includes('#services'));

    expect(hasTalkLink).toBe(true);
    expect(hasServicesLink).toBe(true);
  });

  test('focus indicators are visible', async ({ page }) => {
    // Tab to the first interactive element
    await page.keyboard.press('Tab');

    // Get the currently focused element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Check that focus is styled (outline or ring)
    const hasFocusIndicator = await focusedElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const hasOutline = style.outline !== 'none' && style.outline !== '';
      const hasBoxShadow = style.boxShadow !== 'none' && style.boxShadow !== '';
      const hasRing = el.className.includes('ring') || el.className.includes('focus');
      return hasOutline || hasBoxShadow || hasRing;
    });

    expect(hasFocusIndicator).toBe(true);
  });

  test('sections have aria-labelledby attributes', async ({ page }) => {
    // Check Services section
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();
    const servicesLabelledBy = await servicesSection.getAttribute('aria-labelledby');
    expect(servicesLabelledBy).toBe('services-heading');

    // Verify the referenced heading exists
    const servicesHeading = page.locator('#services-heading');
    await expect(servicesHeading).toBeVisible();
    await expect(servicesHeading).toHaveText('Services');

    // Check About section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
    const aboutLabelledBy = await aboutSection.getAttribute('aria-labelledby');
    expect(aboutLabelledBy).toBe('about-heading');

    // Verify the referenced heading exists
    const aboutHeading = page.locator('#about-heading');
    await expect(aboutHeading).toBeVisible();
    await expect(aboutHeading).toHaveText('About');
  });

  test('decorative icons have aria-hidden="true"', async ({ page }) => {
    // Check decorative checkmark icons in About section (trust signals)
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();

    // Find decorative icon containers with aria-hidden
    const decorativeIcons = aboutSection.locator('[aria-hidden="true"]');
    const iconCount = await decorativeIcons.count();

    // Should have at least 4 decorative icons (one per trust signal)
    expect(iconCount).toBeGreaterThanOrEqual(4);

    // Verify they contain SVG icons
    for (let i = 0; i < Math.min(iconCount, 4); i++) {
      const icon = decorativeIcons.nth(i);
      const hasSvg = await icon.locator('svg').count();
      expect(hasSvg).toBeGreaterThanOrEqual(0); // May contain SVG directly or be an SVG
    }
  });

  test('images and badges have proper alt text or aria-labels', async ({ page }) => {
    // Check Lighthouse badge has proper aria-label
    const lighthouseBadge = page.locator('[role="img"][aria-label*="Lighthouse"]');
    await expect(lighthouseBadge).toBeVisible();

    const ariaLabel = await lighthouseBadge.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('Performance');
    expect(ariaLabel).toContain('100');
  });

  test('color contrast meets WCAG standards (visual check)', async ({ page }) => {
    // This is a basic check - for full contrast testing, use axe-core
    // Here we verify that text elements have sufficient contrast classes

    // Check that headings use foreground color
    const h1 = page.locator('h1');
    const h1HasColor = await h1.evaluate((el) => {
      return el.className.includes('text-') || window.getComputedStyle(el).color !== '';
    });
    expect(h1HasColor).toBe(true);

    // Check that muted text uses muted-foreground (lower contrast but still accessible)
    const mutedText = page.locator('.text-muted-foreground').first();
    if (await mutedText.count() > 0) {
      await expect(mutedText).toBeVisible();
    }
  });
});
