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

  it("accepts a real phone number and email", () => {
    const good = {
      ...defaultConfig,
      business: {
        ...defaultConfig.business,
        phone: "(406) 450-4247",
        textNumber: "406-450-4247",
        email: "neatblisscleaning@gmail.com",
      },
    };
    expect(configSchema.safeParse(good).success).toBe(true);
  });

  it("keeps accepting bracketed placeholders", () => {
    const withPlaceholders = {
      ...defaultConfig,
      business: {
        ...defaultConfig.business,
        phone: "[PHONE NUMBER]",
        email: "[EMAIL ADDRESS]",
      },
    };
    expect(configSchema.safeParse(withPlaceholders).success).toBe(true);
  });

  it("rejects a malformed phone number", () => {
    const bad = {
      ...defaultConfig,
      business: { ...defaultConfig.business, phone: "406-450-42477" },
    };
    const result = configSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("rejects a malformed text number", () => {
    const bad = {
      ...defaultConfig,
      business: { ...defaultConfig.business, textNumber: "not a number" },
    };
    expect(configSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const bad = {
      ...defaultConfig,
      business: { ...defaultConfig.business, email: "neatbliss at gmail" },
    };
    expect(configSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects services when not an array", () => {
    const bad = { ...defaultConfig, services: "nope" as unknown as [] };
    const result = configSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("accepts a service with a valid icon name", () => {
    const good = {
      ...defaultConfig,
      services: [
        {
          ...defaultConfig.services[0],
          icon: "house",
        },
        ...defaultConfig.services.slice(1),
      ],
    };
    expect(configSchema.safeParse(good).success).toBe(true);
  });

  it("accepts a service with no icon field", () => {
    expect(configSchema.safeParse(defaultConfig).success).toBe(true);
  });

  it("rejects an unknown icon name with a friendly message", () => {
    const bad = {
      ...defaultConfig,
      services: [
        {
          ...defaultConfig.services[0],
          icon: "banana",
        },
        ...defaultConfig.services.slice(1),
      ],
    };
    const result = configSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "";
      expect(message).toMatch(/calendar/);
      expect(message).toMatch(/key/);
    }
  });
});
