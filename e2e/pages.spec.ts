import { expect, test } from "@playwright/test";
import { loadConfig } from "./fixtures";

test.describe("Services and quote pages", () => {
  test("services page renders", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("heading", { level: 1, name: "Services" }),
    ).toBeVisible();
  });

  test("quote page call card has a tel: href", async ({ page }) => {
    await page.goto("/quote");
    await expect(
      page.getByRole("heading", { level: 1, name: "Get a free quote" }),
    ).toBeVisible();

    const callLink = page.getByRole("link", { name: /Call us/i }).first();
    await expect(callLink).toBeVisible();
    const href = await callLink.getAttribute("href");
    expect(href).toMatch(/^tel:/);
  });

  test("deep link to /quote works directly under vite preview", async ({
    page,
  }) => {
    const response = await page.goto("/quote");
    expect(response?.status()).toBe(200);
    const business = (loadConfig().business as { phone: string });
    const callLink = page.getByRole("link", { name: /Call us/i }).first();
    const digits = business.phone.replace(/\D/g, "");
    if (digits.length > 0) {
      // Retries until the runtime config fetch has replaced the baked defaults.
      await expect(callLink).toHaveAttribute("href", `tel:${digits}`);
    } else {
      const href = await callLink.getAttribute("href");
      expect(href).toMatch(/^tel:/);
    }
  });
});
