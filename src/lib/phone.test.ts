import { describe, expect, it } from "vitest";
import { smsHref, telHref } from "./phone";

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

describe("smsHref", () => {
  it("strips non digit characters", () => {
    expect(smsHref("555.123.4567")).toBe("sms:5551234567");
  });

  it("preserves a leading plus", () => {
    expect(smsHref("+44 20 7946 0958")).toBe("sms:+442079460958");
  });
});
