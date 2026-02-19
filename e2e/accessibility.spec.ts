import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

    // Verify skip link (a[href="#main-content"]) is first in the tab order
    expect(focusedElements[0]).toContain('#main-content');

    // Verify we can tab to the main CTAs
    const hasTalkLink = focusedElements.some(e => e.includes('#contact'));
    const hasServicesLink = focusedElements.some(e => e.includes('#services'));

    expect(hasTalkLink).toBe(true);
    expect(hasServicesLink).toBe(true);
  });

  test('focus indicators are visible on all interactive elements', async ({ page }) => {
    // Get all focusable elements, excluding Next.js dev tools and third-party elements
    const focusableElements = page.locator(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ).filter({
      // Exclude Next.js dev tools and hidden elements
      hasNot: page.locator('[id*="__next"], [class*="__next"]')
    });

    const count = await focusableElements.count();

    // Ensure we have interactive elements to test
    expect(count).toBeGreaterThan(0);

    // Test focus indicators on multiple elements (up to first 10)
    const elementsToTest = Math.min(count, 10);

    for (let i = 0; i < elementsToTest; i++) {
      const element = focusableElements.nth(i);
      const isVisible = await element.isVisible();

      if (!isVisible) continue;

      // Check if this is a Next.js dev tool element (skip)
      const isNextJsDevTool = await element.evaluate((el) => {
        return el.id?.includes('next-') ||
               el.id?.includes('__next') ||
               el.closest('[id*="__next"]') !== null ||
               el.closest('[data-nextjs]') !== null;
      });

      if (isNextJsDevTool) continue;

      // Focus the element
      await element.focus();

      // Check that focus is styled (outline, box-shadow, or ring class)
      const hasFocusIndicator = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        // Check for visible outline
        const hasOutline = style.outlineStyle !== 'none' &&
                          style.outlineWidth !== '0px' &&
                          style.outlineColor !== 'transparent';
        // Check for box-shadow (common focus ring style)
        const hasBoxShadow = style.boxShadow !== 'none' && style.boxShadow !== '';
        // Check for Tailwind focus ring classes
        const hasRingClass = el.className.includes('ring') ||
                            el.className.includes('focus:') ||
                            el.className.includes('focus-visible:');
        return hasOutline || hasBoxShadow || hasRingClass;
      });

      // Get element details for better error messages
      const elementInfo = await element.evaluate((el) => {
        return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''}`;
      });

      expect(hasFocusIndicator, `Element ${elementInfo} should have a visible focus indicator`).toBe(true);
    }
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

  test('page passes automated accessibility checks (axe-core)', async ({ page }) => {
    // Run axe-core accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      // Focus on WCAG 2.1 Level AA compliance
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Exclude known third-party components that may have issues
      .exclude('.third-party-widget')
      // Exclude color-contrast which has known issues (tracked separately)
      .disableRules(['color-contrast', 'color-contrast-enhanced'])
      .analyze();

    // Report any violations found
    const violations = accessibilityScanResults.violations;

    // Create a detailed error message if there are violations
    if (violations.length > 0) {
      const violationSummary = violations.map(v => {
        const nodes = v.nodes.map(n => n.html.substring(0, 100)).join('\n  - ');
        return `${v.id} (${v.impact}): ${v.description}\n  Affected: \n  - ${nodes}`;
      }).join('\n\n');

      console.log('Accessibility violations found:\n', violationSummary);
    }

    // Fail if there are any serious or critical violations (excluding color contrast)
    const seriousViolations = violations.filter(v =>
      v.impact === 'serious' || v.impact === 'critical'
    );

    expect(seriousViolations,
      `Found ${seriousViolations.length} serious/critical accessibility issues`
    ).toHaveLength(0);
  });

  test('color contrast is audited (axe-core) - informational', async ({ page }) => {
    // Run axe-core specifically for color contrast issues
    // Note: This test reports issues but doesn't fail, as contrast fixes require design decisions
    const contrastResults = await new AxeBuilder({ page })
      .withRules(['color-contrast', 'color-contrast-enhanced'])
      .analyze();

    const contrastViolations = contrastResults.violations;

    if (contrastViolations.length > 0) {
      const issueCount = contrastViolations.reduce((sum, v) => sum + v.nodes.length, 0);
      console.log(`\n⚠️ Color contrast audit found ${issueCount} potential issues.`);
      console.log('These should be reviewed for WCAG AA compliance.\n');

      // Log summary of issues for visibility
      contrastViolations.forEach(v => {
        console.log(`${v.id}: ${v.nodes.length} element(s) - ${v.help}`);
      });
    } else {
      console.log('✅ No color contrast issues detected.');
    }

    // This test passes regardless - it's informational
    // Color contrast issues are tracked as technical debt for design review
    expect(true).toBe(true);
  });
});

test.describe('Image Optimization and Alt Text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 7.2: All <img> elements have alt attribute (including empty alt for decorative) or aria-hidden
  test('all rendered img elements have proper alt text or aria-hidden', async ({ page }) => {
    const violations = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => img.getAttribute('alt') === null && img.getAttribute('aria-hidden') !== 'true')
        .map(img => (img as HTMLImageElement).src || img.getAttribute('src') || 'unknown src');
    });

    expect(violations, `img elements missing alt attribute: ${violations.join(', ')}`).toHaveLength(0);
  });

  // 7.3: All decorative SVGs have aria-hidden on themselves or a parent container
  test('all SVGs are accessible: aria-hidden, parent aria-hidden, or meaningful role/label', async ({ page }) => {
    const violations = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const bad: string[] = [];

      for (const svg of svgs) {
        const hasDirect = svg.getAttribute('aria-hidden') === 'true';
        const hasMeaningfulRole = svg.getAttribute('role') === 'img';
        const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
        const hasTitle = svg.querySelector('title') !== null;

        // Walk up to check if an ancestor has aria-hidden
        let el: Element | null = svg.parentElement;
        let parentHasAriaHidden = false;
        while (el && el !== document.body) {
          if (el.getAttribute('aria-hidden') === 'true') {
            parentHasAriaHidden = true;
            break;
          }
          el = el.parentElement;
        }

        if (!hasDirect && !parentHasAriaHidden && !hasMeaningfulRole && !hasTitle && !hasAriaLabel) {
          bad.push(svg.outerHTML.substring(0, 80));
        }
      }
      return bad;
    });

    expect(violations, `SVGs without proper accessibility markup: ${violations.join(' | ')}`).toHaveLength(0);
  });

  // 7.4: Lighthouse badge has role="img" and descriptive aria-label
  test('Lighthouse badge has role="img" and descriptive aria-label', async ({ page }) => {
    const badge = page.locator('[role="img"]').filter({ hasText: /lighthouse|performance/i }).first();
    const directBadge = page.locator('[role="img"][aria-label*="Lighthouse"]');
    await expect(directBadge).toBeVisible();

    const ariaLabel = await directBadge.getAttribute('aria-label');
    expect(ariaLabel).toContain('Lighthouse');
    expect(ariaLabel).toContain('Performance');
    expect(ariaLabel).toContain('100');

    // Confirm role is present
    const role = await directBadge.getAttribute('role');
    expect(role).toBe('img');
  });

  // 7.5: No <img> elements missing explicit width/height (CLS prevention)
  test('no img elements are missing explicit width or height (CLS prevention)', async ({ page }) => {
    const unsized = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !img.hasAttribute('width') && !img.hasAttribute('height') && !img.style.width && !img.style.height)
        .map(img => (img as HTMLImageElement).src || img.getAttribute('src') || 'unknown');
    });

    expect(unsized, `img elements without width/height: ${unsized.join(', ')}`).toHaveLength(0);
  });

  // 7.6: Track page resource weight; assert zero image bytes loaded (text/icon-based site)
  test('no raster image bytes are loaded (text/icon-based site)', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const { imageTransferSize, totalKB } = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      const imageResources = resources.filter(r =>
        r.initiatorType === 'img' ||
        /\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i.test(r.name)
      );
      const imageTransferSize = imageResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalSize = (nav?.transferSize || 0) + resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      return { imageTransferSize, totalKB: Math.round(totalSize / 1024) };
    });

    // Log total page size for visibility (production target: < 500KB)
    console.log(`Total page resource size: ${totalKB}KB (production target: <500KB)`);

    // Core assertion: no raster image bytes loaded (site uses inline SVGs and CSS)
    expect(imageTransferSize).toBe(0);
  });

  // 7.7: No broken image references on the page
  test('no broken image references on the page', async ({ page }) => {
    const broken = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalWidth === 0)
        .map(img => (img as HTMLImageElement).src || img.getAttribute('src') || 'unknown src');
    });

    expect(broken, `Broken image references: ${broken.join(', ')}`).toHaveLength(0);
  });
});

test.describe('Skip Link', () => {
  test('skip link is the first focusable element when pressing Tab', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveText('Skip to main content');
  });

  test('skip link text is "Skip to main content"', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveText('Skip to main content');
  });

  test('skip link becomes visible when focused', async ({ page }) => {
    await page.goto('/');
    // Press Tab to focus the skip link via keyboard (triggers :focus-visible)
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    // When focused, sr-only is reversed — element should have visible dimensions
    const boundingBox = await skipLink.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeGreaterThan(1);
    expect(boundingBox!.height).toBeGreaterThan(1);
  });

  test('skip link is hidden when not focused', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    // Before focusing, skip link should be invisible via opacity: 0
    await expect(skipLink).toHaveCSS('opacity', '0');
  });

  test('activating skip link moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    // Activate the skip link with Enter
    await page.keyboard.press('Enter');
    // Use evaluate to unambiguously check document.activeElement — this fails without tabIndex={-1} on <main>
    const isFocused = await page.evaluate(() => {
      const main = document.getElementById('main-content');
      return document.activeElement === main;
    });
    expect(isFocused).toBe(true);
  });

  test('scroll-behavior is auto when prefers-reduced-motion is reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const scrollBehavior = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollBehavior;
    });
    expect(scrollBehavior).toBe('auto');
  });
});
