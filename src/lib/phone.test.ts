import { describe, expect, it } from "vitest";
import { formatUsPhone, isValidUsPhone, smsHref, telHref } from "./phone";

describe("telHref", () => {
  it("strips spaces, dashes, and parens", () => {
    expect(telHref("(555) 123-4567")).toBe("tel:5551234567");
  });

  it("keeps a leading plus for international numbers", () => {
    expect(telHref("+1 (555) 123-4567")).toBe("tel:+15551234567");
  });

  it("drops a plus that is not leading", () => {
    expect(telHref("555+123")).toBe("tel:555123");
  });

  it("handles a bracketed placeholder to just the tel: prefix", () => {
    expect(telHref("[PHONE NUMBER]")).toBe("tel:");
  });

  it("normalizes letters and punctuation", () => {
    expect(telHref("call 1-800-FLOWERS")).toBe("tel:1800");
  });
});

describe("isValidUsPhone", () => {
  it("accepts 10 digit numbers in common formats", () => {
    expect(isValidUsPhone("4064504247")).toBe(true);
    expect(isValidUsPhone("406-450-4247")).toBe(true);
    expect(isValidUsPhone("(406) 450-4247")).toBe(true);
    expect(isValidUsPhone("406.450.4247".replace(/\./g, "-"))).toBe(true);
  });

  it("accepts 11 digits with a leading 1", () => {
    expect(isValidUsPhone("1-406-450-4247")).toBe(true);
    expect(isValidUsPhone("+1 (406) 450-4247")).toBe(true);
  });

  it("rejects wrong digit counts", () => {
    expect(isValidUsPhone("406-450-424")).toBe(false);
    expect(isValidUsPhone("406-450-42477")).toBe(false);
    expect(isValidUsPhone("")).toBe(false);
  });

  it("rejects letters and placeholders", () => {
    expect(isValidUsPhone("call me maybe")).toBe(false);
    expect(isValidUsPhone("[PHONE NUMBER]")).toBe(false);
    expect(isValidUsPhone("1-800-FLOWERS1")).toBe(false);
  });
});

describe("formatUsPhone", () => {
  it("formats valid numbers as (406) 450-4247", () => {
    expect(formatUsPhone("4064504247")).toBe("(406) 450-4247");
    expect(formatUsPhone("406-450-4247")).toBe("(406) 450-4247");
    expect(formatUsPhone("+1 406 450 4247")).toBe("(406) 450-4247");
  });

  it("returns invalid input unchanged", () => {
    expect(formatUsPhone("[PHONE NUMBER]")).toBe("[PHONE NUMBER]");
    expect(formatUsPhone("406-450")).toBe("406-450");
  });
});

describe("smsHref", () => {
  it("strips non digit characters", () => {
    expect(smsHref("555.123.4567")).toBe("sms:5551234567");
  });

  it("preserves a leading plus", () => {
    expect(smsHref("+44 20 7946 0958")).toBe("sms:+442079460958");
  });
});
