import { test, expect } from "@playwright/test";

test.describe("WhatsApp Floating Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders and is visible on page load", async ({ page }) => {
    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    await expect(button).toBeVisible();
  });

  test("has correct aria-label", async ({ page }) => {
    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    await expect(button).toHaveAttribute(
      "aria-label",
      "Contact via WhatsApp"
    );
  });

  test("href contains wa.me and pre-filled message text", async ({ page }) => {
    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    const href = await button.getAttribute("href");
    expect(href).toContain("wa.me");
    expect(href).toContain(
      encodeURIComponent(
        "Hi Jon, I found your site and I'm interested in a website for my business."
      )
    );
  });

  test("has target=_blank and rel=noopener noreferrer", async ({ page }) => {
    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    await expect(button).toHaveAttribute("target", "_blank");
    await expect(button).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("button size is >= 56x56px (touch target)", async ({ page }) => {
    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(56);
    expect(box!.height).toBeGreaterThanOrEqual(56);
  });

  test("button has focus-visible styling on keyboard navigation", async ({
    page,
  }) => {
    // Tab to the WhatsApp button (it's after main content)
    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    await button.focus();
    await page.keyboard.press("Tab");
    await button.focus();

    // Check focus-visible outline via computed style
    const outlineStyle = await button.evaluate((el) => {
      // Force :focus-visible state
      el.focus();
      const style = window.getComputedStyle(el);
      return {
        outlineColor: style.outlineColor,
        outlineWidth: style.outlineWidth,
        outlineOffset: style.outlineOffset,
      };
    });

    // The focus-visible outline should be applied when focused via keyboard
    // We verify the outline-offset is set (2px)
    expect(outlineStyle.outlineOffset).toBe("2px");
  });

  test("desktop positioning is 24px from edges", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    const box = await button.boundingBox();
    expect(box).not.toBeNull();

    const viewport = page.viewportSize()!;
    const rightOffset = viewport.width - (box!.x + box!.width);
    const bottomOffset = viewport.height - (box!.y + box!.height);

    // 24px = Tailwind's bottom-6 right-6
    expect(rightOffset).toBeCloseTo(24, 0);
    expect(bottomOffset).toBeCloseTo(24, 0);
  });

  test("mobile positioning is 16px from edges", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    const box = await button.boundingBox();
    expect(box).not.toBeNull();

    const viewport = page.viewportSize()!;
    const rightOffset = viewport.width - (box!.x + box!.width);
    const bottomOffset = viewport.height - (box!.y + box!.height);

    // 16px = Tailwind's bottom-4 right-4
    expect(rightOffset).toBeCloseTo(16, 0);
    expect(bottomOffset).toBeCloseTo(16, 0);
  });

  test("button z-index is above page content", async ({ page }) => {
    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    const zIndex = await button.evaluate(
      (el) => window.getComputedStyle(el).zIndex
    );
    expect(Number(zIndex)).toBeGreaterThanOrEqual(50);
  });
});

test.describe("WhatsApp Button - Reduced Motion", () => {
  test("no scale transition when prefers-reduced-motion: reduce", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const button = page.getByRole("link", { name: "Contact via WhatsApp" });
    await expect(button).toBeVisible();

    // With reduced motion, the button should NOT have a transition duration
    const transitionDuration = await button.evaluate(
      (el) => window.getComputedStyle(el).transitionDuration
    );
    // Should be 0s (no animation) when reduced motion is active
    expect(transitionDuration).toBe("0s");
  });
});
