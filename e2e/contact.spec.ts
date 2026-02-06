import { test, expect } from "@playwright/test";

test.describe("Contact Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Form Rendering", () => {
    test("displays contact heading with inviting copy", async ({ page }) => {
      const heading = page.locator("#contact-heading");
      await expect(heading).toHaveText("Contact");
      await expect(page.getByText("No pressure. No jargon.")).toBeVisible();
    });

    test("renders all form fields with labels", async ({ page }) => {
      await expect(page.getByLabel("Name")).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Message")).toBeVisible();
    });

    test('submit button displays "Send Message"', async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "Send Message" })
      ).toBeVisible();
    });

    test("honeypot field is hidden from users", async ({ page }) => {
      const honeypot = page.locator('input[name="website"]');
      await expect(honeypot).toBeHidden();
    });
  });

  test.describe("Validation", () => {
    test("shows error on blur when name is empty", async ({ page }) => {
      const nameInput = page.getByLabel("Name");
      await nameInput.focus();
      await nameInput.blur();
      await expect(page.getByText("Please enter your name")).toBeVisible();
    });

    test("shows error for invalid email", async ({ page }) => {
      const emailInput = page.getByLabel("Email");
      await emailInput.fill("invalid");
      await emailInput.blur();
      await expect(
        page.getByText("Please enter a valid email address")
      ).toBeVisible();
    });

    test("shows error when message is too short", async ({ page }) => {
      const messageInput = page.getByLabel("Message");
      await messageInput.fill("Hi");
      await messageInput.blur();
      await expect(
        page.getByText("Please tell me a bit about your business")
      ).toBeVisible();
    });

    test("clears error when user starts typing", async ({ page }) => {
      const nameInput = page.getByLabel("Name");
      await nameInput.focus();
      await nameInput.blur();
      await expect(page.getByText("Please enter your name")).toBeVisible();
      await nameInput.fill("John");
      await expect(page.getByText("Please enter your name")).not.toBeVisible();
    });
  });

  test.describe("Submission", () => {
    test("shows loading state during submission", async ({ page }) => {
      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Message").fill("I need a website for my business");

      const submitButton = page.getByRole("button", { name: "Send Message" });
      await submitButton.click();

      // Wait for loading state to appear
      await expect(page.getByText("Sending...")).toBeVisible();
    });

    test("disables fields during submission", async ({ page }) => {
      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Message").fill("I need a website for my business");

      await page.getByRole("button", { name: "Send Message" }).click();

      // Wait for and check disabled state
      await expect(page.getByLabel("Name")).toBeDisabled();
    });

    test("displays success message after submission", async ({ page }) => {
      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Message").fill("I need a website for my business");

      await page.getByRole("button", { name: "Send Message" }).click();

      await expect(page.getByText("Thanks, John Doe!")).toBeVisible();
      await expect(
        page.getByText("I'll respond within 24 hours")
      ).toBeVisible();
    });

    test("does not submit if honeypot is filled", async ({ page }) => {
      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Message").fill("I need a website for my business");

      // Fill honeypot (simulating bot behavior)
      await page.locator('input[name="website"]').fill("spam-bot-value", {
        force: true,
      });

      await page.getByRole("button", { name: "Send Message" }).click();

      // Form should not show success (it silently rejects)
      await expect(page.getByText("Thanks, John Doe!")).not.toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("form inputs meet minimum touch target size", async ({ page }) => {
      const nameInput = page.getByLabel("Name");
      const box = await nameInput.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });

    test("success message has proper ARIA attributes", async ({ page }) => {
      await page.getByLabel("Name").fill("Test User");
      await page.getByLabel("Email").fill("test@example.com");
      await page.getByLabel("Message").fill("Test message for business");
      await page.getByRole("button", { name: "Send Message" }).click();

      const successMessage = page.locator('[role="status"]');
      await expect(successMessage).toHaveAttribute("aria-live", "polite");
    });

    test("keyboard navigation works through form", async ({ page }) => {
      // Navigate to contact section first
      await page.getByLabel("Name").focus();
      await page.keyboard.press("Tab");
      await expect(page.getByLabel("Email")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(page.getByLabel("Message")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("button", { name: "Send Message" })
      ).toBeFocused();
    });

    test("error messages are linked to fields with aria-describedby", async ({
      page,
    }) => {
      const nameInput = page.getByLabel("Name");
      await nameInput.click();
      // Click elsewhere to trigger blur and show error
      await page.getByLabel("Email").click();

      // Check that the error is linked to the input
      const describedBy = await nameInput.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();

      // Verify the error element exists with that ID
      const errorElement = page.locator(`#${describedBy}`);
      await expect(errorElement).toHaveText("Please enter your name");
    });

    test("invalid fields have aria-invalid attribute", async ({ page }) => {
      const nameInput = page.getByLabel("Name");
      await nameInput.click();
      // Click elsewhere to trigger blur and show error
      await page.getByLabel("Email").click();

      await expect(nameInput).toHaveAttribute("aria-invalid", "true");
    });
  });
});
