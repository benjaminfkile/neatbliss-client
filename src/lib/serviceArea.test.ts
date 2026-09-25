import { describe, it, expect } from "vitest";
import { serviceAreaCity } from "./serviceArea";

describe("serviceAreaCity", () => {
  it("extracts the city before ' and '", () => {
    expect(serviceAreaCity("[CITY] and nearby areas")).toBe("[CITY]");
    expect(serviceAreaCity("Rockford and surrounding towns")).toBe("Rockford");
  });

  it("returns the whole string when no ' and ' is present", () => {
    expect(serviceAreaCity("Rockford")).toBe("Rockford");
    expect(serviceAreaCity("  Rockford  ")).toBe("Rockford");
  });

  it("is case insensitive for the separator", () => {
    expect(serviceAreaCity("Springfield And nearby areas")).toBe(
      "Springfield",
    );
  });
});
