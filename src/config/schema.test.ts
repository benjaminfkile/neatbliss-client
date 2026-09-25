import { describe, expect, it } from "vitest";
import { configSchema, defaultConfig } from "./schema";

describe("configSchema", () => {
  it("accepts defaultConfig", () => {
    const result = configSchema.safeParse(defaultConfig);
    expect(result.success).toBe(true);
  });

  it("rejects a config missing business.name", () => {
    const bad = {
      ...defaultConfig,
      business: { ...defaultConfig.business, name: "" },
    };
    const result = configSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("rejects an empty services array", () => {
    const bad = { ...defaultConfig, services: [] };
    const result = configSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("rejects services when not an array", () => {
    const bad = { ...defaultConfig, services: "nope" as unknown as [] };
    const result = configSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });
});
