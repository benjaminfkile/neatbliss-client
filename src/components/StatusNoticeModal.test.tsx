import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  NOTICE_STORAGE_KEY,
  StatusNoticeModal,
} from "./StatusNoticeModal";

describe("StatusNoticeModal", () => {
  let container: HTMLDivElement;
  let root: Root | null = null;

  beforeEach(() => {
    window.sessionStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    if (root) {
      act(() => root!.unmount());
      root = null;
    }
    container.remove();
    document.body.style.overflow = "";
    window.sessionStorage.clear();
  });

  function render(props: {
    enabled: boolean;
    message: string;
    disabled?: boolean;
  }) {
    act(() => {
      root!.render(<StatusNoticeModal {...props} />);
    });
  }

  function findDialog(): HTMLElement | null {
    return document.querySelector('[role="dialog"]');
  }

  function findGotItButton(): HTMLButtonElement | null {
    return Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Got it",
    ) as HTMLButtonElement | undefined ?? null;
  }

  it("opens when enabled with a message and nothing stored", () => {
    render({ enabled: true, message: "Booked out until spring." });
    const dialog = findDialog();
    expect(dialog).not.toBeNull();
    expect(dialog!.getAttribute("aria-modal")).toBe("true");
    expect(dialog!.textContent).toContain("A quick note");
    expect(dialog!.textContent).toContain("Booked out until spring.");
  });

  it("does not open when stored value equals the current message", () => {
    const msg = "Same message";
    window.sessionStorage.setItem(NOTICE_STORAGE_KEY, msg);
    render({ enabled: true, message: msg });
    expect(findDialog()).toBeNull();
  });

  it("opens again when the message changes", () => {
    render({ enabled: true, message: "First message" });
    expect(findDialog()).not.toBeNull();

    act(() => {
      findGotItButton()!.click();
    });
    expect(findDialog()).toBeNull();
    expect(window.sessionStorage.getItem(NOTICE_STORAGE_KEY)).toBe(
      "First message",
    );

    render({ enabled: true, message: "New message" });
    expect(findDialog()).not.toBeNull();
    expect(findDialog()!.textContent).toContain("New message");
  });

  it("never opens when disabled", () => {
    render({ enabled: false, message: "Anything" });
    expect(findDialog()).toBeNull();
  });

  it("never opens when the message is empty or whitespace", () => {
    render({ enabled: true, message: "" });
    expect(findDialog()).toBeNull();

    render({ enabled: true, message: "   " });
    expect(findDialog()).toBeNull();
  });

  it("never opens when source is draft (disabled prop true)", () => {
    render({
      enabled: true,
      message: "Draft preview message",
      disabled: true,
    });
    expect(findDialog()).toBeNull();
  });

  it("dismiss writes the storage key", () => {
    const msg = "Please read this.";
    render({ enabled: true, message: msg });
    expect(findDialog()).not.toBeNull();
    act(() => {
      findGotItButton()!.click();
    });
    expect(findDialog()).toBeNull();
    expect(window.sessionStorage.getItem(NOTICE_STORAGE_KEY)).toBe(msg);
  });

  it("still shows the modal and dismisses as session-only when sessionStorage getItem throws", () => {
    const originalGet = Storage.prototype.getItem;
    Storage.prototype.getItem = function () {
      throw new Error("blocked");
    };
    try {
      render({ enabled: true, message: "Read me" });
      expect(findDialog()).not.toBeNull();
    } finally {
      Storage.prototype.getItem = originalGet;
    }
  });

  it("dismissal survives even when sessionStorage setItem throws", () => {
    const originalSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function () {
      throw new Error("blocked");
    };
    try {
      render({ enabled: true, message: "Read me" });
      expect(findDialog()).not.toBeNull();
      act(() => {
        findGotItButton()!.click();
      });
      expect(findDialog()).toBeNull();
    } finally {
      Storage.prototype.setItem = originalSet;
    }
  });
});
