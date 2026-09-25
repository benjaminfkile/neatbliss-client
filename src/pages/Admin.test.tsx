import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AdminPage } from "./Admin";
import {
  configToForm,
  formToConfig,
  serializeConfig,
  validateForm,
  type FormState,
} from "./Admin.helpers";
import { configSchema, defaultConfig, type SiteConfig } from "../config/schema";
import { ConfigProvider, DRAFT_STORAGE_KEY } from "../config/ConfigProvider";
import { ADMIN_ROUTE } from "../routes";

describe("admin form helpers", () => {
  it("round trips form <-> config through configSchema with quotes, apostrophes, and multi line strings", () => {
    const tricky: SiteConfig = {
      status: {
        enabled: true,
        message:
          'She said "we\'re booked".\nCheck back in June.',
      },
      business: {
        name: 'O\'Brien "Bliss" Co.',
        tagline: 'Come home.\nBreathe in.',
        phone: "(555) 123-4567",
        textNumber: "+1 (555) 000-1111",
        email: "hello+tag@example.com",
        facebookUrl: "https://facebook.com/example",
        serviceArea: "Springfield and nearby areas",
      },
      services: [
        {
          title: 'Recurring "top to bottom" cleans',
          description:
            "Line one.\nLine two with apostrophe's and \"quotes\".",
          included: [
            "Kitchens & baths",
            'Windows "sparkling"',
            "Trash out",
          ],
        },
      ],
      testimonials: [
        {
          quote:
            'They\'re "the best".\nMultiline works too.',
          name: "Alex R.",
        },
      ],
      admin: { githubEditUrl: "https://github.com/example/repo/edit/main/public/config.json" },
    };

    const form = configToForm(tricky);
    const rebuilt = formToConfig(form);
    const parsed = configSchema.safeParse(rebuilt);
    expect(parsed.success).toBe(true);
    expect(rebuilt).toEqual(tricky);

    const json = serializeConfig(rebuilt);
    const reparsed = configSchema.safeParse(JSON.parse(json));
    expect(reparsed.success).toBe(true);
    expect(json.endsWith("\n")).toBe(true);
  });

  it("filters blank lines out of included but keeps ordering", () => {
    const form: FormState = {
      status: { enabled: false, message: "" },
      business: { ...defaultConfig.business },
      services: [
        {
          id: "s-x",
          title: "T",
          description: "D",
          included: "one\n\n  \ntwo\nthree",
        },
      ],
      testimonials: [],
      admin: { githubEditUrl: "https://example.com" },
    };
    const cfg = formToConfig(form);
    expect(cfg.services[0].included).toEqual(["one", "two", "three"]);
  });

  it("validateForm produces JSON that reparses to the same config", () => {
    const form = configToForm(defaultConfig);
    const result = validateForm(form);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const round = configSchema.parse(JSON.parse(result.json));
      expect(round).toEqual(defaultConfig);
    }
  });
});

describe("AdminPage", () => {
  let container: HTMLDivElement;
  let root: Root | null = null;

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("no network in tests"))),
    );
  });

  afterEach(() => {
    if (root) {
      act(() => root!.unmount());
      root = null;
    }
    container.remove();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function render() {
    root = createRoot(container);
    act(() => {
      root!.render(
        <ConfigProvider>
          <MemoryRouter initialEntries={[ADMIN_ROUTE]}>
            <Routes>
              <Route path={ADMIN_ROUTE} element={<AdminPage />} />
              <Route path="/" element={<div data-testid="home">home</div>} />
            </Routes>
          </MemoryRouter>
        </ConfigProvider>,
      );
    });
  }

  it("does not allow removing the last service (button is disabled)", () => {
    render();
    // remove services down to 1
    const findRemoveButtons = () =>
      Array.from(
        container.querySelectorAll('button[aria-label^="Remove service"]'),
      ) as HTMLButtonElement[];

    let buttons = findRemoveButtons();
    // default has 3; click the first two enabled ones
    while (buttons.filter((b) => !b.disabled).length > 1) {
      const enabled = buttons.find((b) => !b.disabled);
      if (!enabled) break;
      act(() => {
        enabled.click();
      });
      buttons = findRemoveButtons();
    }
    buttons = findRemoveButtons();
    expect(buttons.length).toBe(1);
    expect(buttons[0].disabled).toBe(true);
    // clicking the disabled button should not remove it
    act(() => {
      buttons[0].click();
    });
    expect(findRemoveButtons().length).toBe(1);
  });

  it("preset chip sets the status message and enables the toggle", () => {
    render();
    const chips = Array.from(
      container.querySelectorAll('[role="group"][aria-label="Message presets"] button'),
    ) as HTMLButtonElement[];
    expect(chips.length).toBe(3);
    const target = "Not accepting new clients right now";
    const targetChip = chips.find((c) => c.textContent === target);
    expect(targetChip).toBeTruthy();
    act(() => {
      targetChip!.click();
    });
    const textarea = container.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe(target);
    const toggle = container.querySelector(
      'button[role="switch"]',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("preview saves a draft to localStorage that round trips through the schema", () => {
    render();
    // Toggle status on and set a message
    const toggle = container.querySelector(
      'button[role="switch"]',
    ) as HTMLButtonElement;
    act(() => {
      toggle.click();
    });
    const textarea = container.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )!.set!;
      setter.call(textarea, 'Booked out until "June".\nSee you soon!');
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });

    const previewBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Preview my changes",
    ) as HTMLButtonElement;
    act(() => {
      previewBtn.click();
    });

    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = configSchema.safeParse(JSON.parse(raw!));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status.enabled).toBe(true);
      expect(parsed.data.status.message).toBe(
        'Booked out until "June".\nSee you soon!',
      );
    }
  });

  it("copy button writes valid JSON to the clipboard and shows Copied!", async () => {
    render();
    const written: string[] = [];
    const writeText = vi.fn((text: string) => {
      written.push(text);
      return Promise.resolve();
    });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    const copyBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Copy my settings",
    ) as HTMLButtonElement;

    await act(async () => {
      copyBtn.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(written.length).toBe(1);
    const cfg = configSchema.parse(JSON.parse(written[0]));
    expect(cfg.business.name).toBe(defaultConfig.business.name);
    const label = Array.from(container.querySelectorAll("button"))
      .map((b) => b.textContent?.trim())
      .filter((t) => t === "Copied!");
    expect(label.length).toBe(1);
  });

  it("shows a fallback textarea when clipboard rejects", async () => {
    render();
    const writeText = vi.fn(() =>
      Promise.reject(new Error("permission denied")),
    );
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    const copyBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Copy my settings",
    ) as HTMLButtonElement;

    await act(async () => {
      copyBtn.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    const fallback = container.querySelector(
      "textarea[readOnly], textarea[readonly]",
    ) as HTMLTextAreaElement | null;
    expect(fallback).not.toBeNull();
    expect(fallback!.value.length).toBeGreaterThan(0);
    const parsed = configSchema.safeParse(JSON.parse(fallback!.value));
    expect(parsed.success).toBe(true);
  });
});
