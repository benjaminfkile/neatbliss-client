import { expect, test } from "@playwright/test";
import { loadConfig } from "./fixtures";

test.describe("Home page", () => {
  test("renders tagline and service titles from config.json", async ({ page }) => {
    const config = loadConfig();
    const business = config.business as { tagline: string };
    const services = config.services as Array<{ title: string }>;

    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: business.tagline }),
    ).toBeVisible();

    for (const service of services) {
      await expect(
        page.getByRole("heading", { level: 3, name: service.title }),
      ).toBeVisible();
    }
  });

  test("footer phone and email are tappable links", async ({ page }) => {
    const business = loadConfig().business as {
      phone: string;
      email: string;
    };

    await page.goto("/");
    const footer = page.locator("footer");

    const phoneLink = footer.getByRole("link", { name: business.phone });
    const digits = business.phone.replace(/\D/g, "");
    await expect(phoneLink).toHaveAttribute(
      "href",
      digits.length > 0 ? `tel:${digits}` : /^tel:/,
    );

    const emailLink = footer.getByRole("link", { name: business.email });
    await expect(emailLink).toHaveAttribute(
      "href",
      `mailto:${business.email}`,
    );
  });
});
