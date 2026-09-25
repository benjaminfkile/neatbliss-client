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
});
