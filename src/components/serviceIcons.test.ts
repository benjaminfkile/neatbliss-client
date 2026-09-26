import { describe, expect, it } from "vitest";
import {
  SERVICE_ICON_NAMES,
  getServiceIcon,
  getServiceIconName,
  isServiceIconName,
} from "./serviceIcons";

describe("serviceIcons lookup", () => {
  it("returns the named component when the name is known", () => {
    for (const name of SERVICE_ICON_NAMES) {
      const Icon = getServiceIcon(name, 0);
      expect(typeof Icon).toBe("function");
      expect(getServiceIconName(name, 5)).toBe(name);
    }
  });

  it("falls back through the legacy cycle for missing names", () => {
    expect(getServiceIconName(undefined, 0)).toBe("calendar");
    expect(getServiceIconName(undefined, 1)).toBe("sparkles");
    expect(getServiceIconName(undefined, 2)).toBe("box");
    expect(getServiceIconName(undefined, 3)).toBe("calendar");
    expect(getServiceIconName(null, 4)).toBe("sparkles");
  });

  it("falls back through the legacy cycle for unknown names", () => {
    expect(getServiceIconName("banana", 0)).toBe("calendar");
    expect(getServiceIconName("banana", 1)).toBe("sparkles");
    expect(getServiceIconName("", 2)).toBe("box");
    expect(getServiceIcon("banana", 0)).toBe(getServiceIcon("calendar", 0));
  });

  it("isServiceIconName accepts known names and rejects the rest", () => {
    expect(isServiceIconName("calendar")).toBe(true);
    expect(isServiceIconName("banana")).toBe(false);
    expect(isServiceIconName(undefined)).toBe(false);
    expect(isServiceIconName(42)).toBe(false);
  });
});
