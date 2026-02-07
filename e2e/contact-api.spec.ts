import { test, expect } from "@playwright/test";

test.describe("Contact API Route", () => {
  test.describe("Method Handling", () => {
    test("returns 405 for GET requests", async ({ request }) => {
      const response = await request.get("/api/contact");
      expect(response.status()).toBe(405);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe("Method Not Allowed");
    });
  });

  test.describe("Validation", () => {
    test("returns 400 when name is missing", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "", email: "test@example.com", message: "Hello there, I need help" },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBeTruthy();
    });

    test("returns 400 when email is missing", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "John Doe", email: "", message: "Hello there, I need help" },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBeTruthy();
    });

    test("returns 400 when message is missing", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "John Doe", email: "test@example.com", message: "" },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBeTruthy();
    });

    test("returns 400 for invalid email format", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "John Doe", email: "not-an-email", message: "Hello there, I need help" },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("valid email");
    });

    test("returns 400 when all fields are whitespace-only", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "   ", email: "   ", message: "   " },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("returns 400 when name is too short", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "J", email: "test@example.com", message: "Hello there, I need help with my project" },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("Name must be");
    });

    test("returns 400 when message is too short", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: { name: "John Doe", email: "test@example.com", message: "Hi" },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("Message must be");
    });
  });

  test.describe("Honeypot", () => {
    test("returns fake 200 success when honeypot is filled", async ({ request }) => {
      const response = await request.post("/api/contact", {
        data: {
          name: "Spam Bot",
          email: "spam@bot.com",
          message: "Buy my stuff",
          website: "http://spam.com",
        },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.message).toBe("Message sent successfully");
    });
  });

  test.describe("Form Integration", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });

    test("form submits successfully via API", async ({ page }) => {
      // Intercept API call and return mock success
      await page.route("**/api/contact", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Message sent successfully",
          }),
        });
      });

      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Message").fill("I need a website for my business");
      await page.getByRole("button", { name: "Send Message" }).click();

      await expect(page.getByText("Thanks, John Doe!")).toBeVisible();
    });

    test("form displays error state when API returns error", async ({ page }) => {
      // Intercept API call and return error
      await page.route("**/api/contact", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            error: "Something went wrong. Please try again.",
          }),
        });
      });

      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Message").fill("I need a website for my business");
      await page.getByRole("button", { name: "Send Message" }).click();

      await expect(page.getByText("Oops!")).toBeVisible();
      await expect(
        page.getByText("Something went wrong. Please try again.")
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Try Again" })
      ).toBeVisible();
    });

    test("honeypot submission through form is silently rejected", async ({ page }) => {
      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Message").fill("I need a website for my business");

      // Fill honeypot (simulating bot behavior) - client-side check silently rejects
      await page.locator('input[name="website"]').fill("spam-bot-value", {
        force: true,
      });

      await page.getByRole("button", { name: "Send Message" }).click();

      // Client-side honeypot check prevents submission entirely - form stays idle
      await expect(page.getByText("Sending...")).not.toBeVisible();
      await expect(page.getByText("Thanks, John Doe!")).not.toBeVisible();
    });
  });
});
