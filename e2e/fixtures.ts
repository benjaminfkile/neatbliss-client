import type { Page, Route } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve(process.cwd(), "public/config.json");

export function loadConfig(): Record<string, unknown> {
  const raw = readFileSync(configPath, "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

export async function interceptConfig(
  page: Page,
  override: Record<string, unknown>,
): Promise<void> {
  const body = JSON.stringify(override);
  await page.route("**/config.json", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body,
    });
  });
}

export function withStatus(
  base: Record<string, unknown>,
  message: string,
): Record<string, unknown> {
  return {
    ...base,
    status: { enabled: true, message },
  };
}
