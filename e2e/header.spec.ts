import { test, expect } from "@playwright/test";

test.describe("Header", () => {
  test.beforeEach(async ({ page }) => {
    // Use desktop viewport for header tests
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("renders with logo and navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("link", { name: "Jon Kumar" })).toBeVisible();
    // Use header-specific locators to avoid matching hero buttons
    const headerNav = page.locator('header nav[aria-label="Main navigation"]');
    await expect(headerNav.getByRole("link", { name: "Services" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "About" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("header is sticky with visual separation", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");

    // Verify header has sticky positioning
    await expect(async () => {
      const position = await header.evaluate(
        (el) => getComputedStyle(el).position
      );
      expect(position).toBe("sticky");
    }).toPass();

    // Verify header has border for visual separation
    await expect(async () => {
      const borderBottom = await header.evaluate(
        (el) => getComputedStyle(el).borderBottomWidth
      );
      expect(parseInt(borderBottom)).toBeGreaterThan(0);
    }).toPass();
  });

  test("navigation scrolls to Services section", async ({ page }) => {
    await page.goto("/");

    // Click Services link in header nav
    const headerNav = page.locator('header nav[aria-label="Main navigation"]');
    await headerNav.getByRole("link", { name: "Services" }).click();

    // Verify scroll position - Services section should be near top of viewport
    await expect(async () => {
      const servicesSection = page.locator("#services");
      const rect = await servicesSection.boundingBox();
      // Account for sticky header height (64px) plus some tolerance
      expect(rect?.y).toBeLessThan(100);
    }).toPass({ timeout: 3000 });
  });

  test("navigation scrolls to About section", async ({ page }) => {
    await page.goto("/");

    // Click About link in header nav
    const headerNav = page.locator('header nav[aria-label="Main navigation"]');
    await headerNav.getByRole("link", { name: "About" }).click();

    // Verify scroll position
    await expect(async () => {
      const aboutSection = page.locator("#about");
      const rect = await aboutSection.boundingBox();
      expect(rect?.y).toBeLessThan(100);
    }).toPass({ timeout: 3000 });
  });

  test("navigation scrolls to Contact section", async ({ page }) => {
    await page.goto("/");

    // Click Contact link in header nav
    const headerNav = page.locator('header nav[aria-label="Main navigation"]');
    await headerNav.getByRole("link", { name: "Contact" }).click();

    // Wait for smooth scroll animation to complete
    await page.waitForTimeout(500);

    // Verify the contact section is visible in viewport
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeInViewport();

    // Verify page has scrolled (scroll position > 0)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});

test.describe("Header - Animation", () => {
  test("mobile menu animation respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /menu/i });
    await menuButton.click();

    // Mobile nav should be immediately visible (no animation delay)
    const mobileNav = page.locator("#mobile-menu");
    await expect(mobileNav).toBeVisible();

    // Opacity should be 1 immediately
    const opacity = await mobileNav.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(opacity).toBe("1");
  });
});

test.describe("Header - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test("hamburger menu is visible on mobile", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });
    await expect(menuButton).toBeVisible();

    // Desktop nav should be hidden
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).not.toBeVisible();
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });

    // Open menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    // Mobile nav should be visible
    const mobileNav = page.locator("#mobile-menu");
    await expect(mobileNav).toBeVisible();

    // Close menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(mobileNav).not.toBeVisible();
  });

  test("mobile menu closes on link click", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });

    // Open menu
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    // Click a link in mobile menu
    await page.locator("#mobile-menu").getByRole("link", { name: "Services" }).click();

    // Menu should close
    await expect(page.locator("#mobile-menu")).not.toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("hamburger button has proper accessibility attributes", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });

    // Check initial state
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toHaveAttribute("aria-controls", "mobile-menu");
    await expect(menuButton).toHaveAttribute("aria-label", "Open menu");

    // Check open state
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(menuButton).toHaveAttribute("aria-label", "Close menu");
  });

  test("hamburger button meets touch target requirements", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });

    // Verify button has minimum touch target size (44x44)
    const box = await menuButton.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test("mobile menu traps focus within menu when open", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });

    // Open menu
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    // Wait for focus to move to first link
    await page.waitForTimeout(200);

    // First link should receive focus when menu opens
    const firstLink = page.locator("#mobile-menu").getByRole("link", { name: "Services" });
    await expect(firstLink).toBeFocused();

    // Tab through all links and verify focus stays in menu
    await page.keyboard.press("Tab");
    const aboutLink = page.locator("#mobile-menu").getByRole("link", { name: "About" });
    await expect(aboutLink).toBeFocused();

    await page.keyboard.press("Tab");
    const contactLink = page.locator("#mobile-menu").getByRole("link", { name: "Contact" });
    await expect(contactLink).toBeFocused();

    // Tab from last element should cycle to first (focus trap)
    await page.keyboard.press("Tab");
    await expect(firstLink).toBeFocused();

    // Shift+Tab from first should go to last
    await page.keyboard.press("Shift+Tab");
    await expect(contactLink).toBeFocused();
  });

  test("mobile menu closes on Escape key", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });

    // Open menu
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    // Press Escape to close
    await page.keyboard.press("Escape");

    // Menu should close
    await expect(page.locator("#mobile-menu")).not.toBeVisible();

    // Focus should return to menu button
    await expect(menuButton).toBeFocused();
  });

  test("mobile menu has proper dialog attributes", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });

    // Open menu
    await menuButton.click();
    const mobileNav = page.locator("#mobile-menu");
    await expect(mobileNav).toBeVisible();

    // Check dialog/modal attributes
    await expect(mobileNav).toHaveAttribute("role", "dialog");
    await expect(mobileNav).toHaveAttribute("aria-modal", "true");
  });
});
