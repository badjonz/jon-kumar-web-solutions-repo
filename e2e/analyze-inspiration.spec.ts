import { test, expect } from '@playwright/test';

test.describe('Animation Analysis', () => {
  test('Analyze Yucca (Animations & Feel)', async ({ page }) => {
    // Record video and trace will be handled by config or CLI flags
    await page.goto('https://yucca.co.za/', { waitUntil: 'networkidle' });

    console.log('--- Yucca.co.za Analysis ---');

    // 1. Check for specific animation libraries
    const hasFramerMotion = await page.evaluate(() => !!document.querySelector('[data-framer-generator]'));
    const hasGSAP = await page.evaluate(() => typeof (window as any).gsap !== 'undefined');
    console.log(`Framer Motion: ${hasFramerMotion}, GSAP: ${hasGSAP}`);

    // 2. Capture Entrance Animations
    // We'll take a screenshot of the hero section after load
    await page.screenshot({ path: 'yucca-hero.png' });

    // 3. Analyze Scroll-Triggered Animations
    // We scroll slowly to see how elements reveal
    const sections = await page.locator('section').all();
    for (let i = 0; i < Math.min(sections.length, 5); i++) {
      await sections[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Wait for animation to finish
      await page.screenshot({ path: `yucca-section-${i}.png` });
    }

    // 4. Hover Effects
    const cta = page.locator('a, button').first();
    if (await cta.isVisible()) {
      await cta.hover();
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'yucca-hover.png' });
    }
  });

  test('Analyze BS Web (Content & Structure)', async ({ page }) => {
    await page.goto('https://www.bsweb.co/', { waitUntil: 'networkidle' });

    console.log('--- BS Web Analysis ---');

    // Capture overall layout
    await page.screenshot({ path: 'bsweb-home.png', fullPage: true });

    // Extract headings to understand content strategy
    const headings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent?.trim());
    });
    console.log('Headings:', headings);
  });
});
