import { expect, test } from "@playwright/test";
import { interceptConfig, loadConfig, withStatus } from "./fixtures";

test.describe("Status notice modal", () => {
  test("shows on /, closes with Got it, banner stays, reload does not reopen", async ({
    page,
  }) => {
    const message = `Notice modal e2e ${Date.now()}`;
    await interceptConfig(page, withStatus(loadConfig(), message));

    await page.goto("/");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("A quick note");
    await expect(dialog).toContainText(message);

    await dialog.getByRole("button", { name: "Got it" }).click();
    await expect(dialog).toHaveCount(0);

    const banner = page.getByRole("status");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(message);

    await page.reload();
    await expect(page.getByRole("status")).toContainText(message);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("reopens when the message changes", async ({ page }) => {
    const first = `Notice A ${Date.now()}`;
    await interceptConfig(page, withStatus(loadConfig(), first));

    await page.goto("/");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(first);
    await dialog.getByRole("button", { name: "Got it" }).click();
    await expect(dialog).toHaveCount(0);

    const second = `Notice B ${Date.now() + 1}`;
    await page.unroute("**/config.json");
    await interceptConfig(page, withStatus(loadConfig(), second));

    await page.goto("/services");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText(second);
  });

  test("enabled false shows no modal", async ({ page }) => {
    const base = loadConfig();
    const override = {
      ...base,
      status: { enabled: false, message: "not shown" },
    };
    await interceptConfig(page, override);

    await page.goto("/");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
