import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./Home";
import { ServicesPage } from "./Services";
import { QuotePage } from "./Quote";
import { ConfigProvider } from "../config/ConfigProvider";
import { defaultConfig } from "../config/schema";
import { serviceAreaCity } from "../lib/serviceArea";

function mountAt(path: string, element: React.ReactNode, container: HTMLElement) {
  const root = createRoot(container);
  act(() => {
    root.render(
      <ConfigProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={path} element={element} />
          </Routes>
        </MemoryRouter>
      </ConfigProvider>,
    );
  });
  return root;
}

describe("public pages", () => {
  let container: HTMLDivElement;
  let root: Root | null = null;

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (root) {
      act(() => root!.unmount());
      root = null;
    }
    container.remove();
  });

  it("home renders tagline, services, testimonials, and CTA copy", () => {
    root = mountAt("/", <HomePage />, container);
    const html = container.innerHTML;
    expect(html).toContain(defaultConfig.business.tagline);
    for (const s of defaultConfig.services) {
      expect(html).toContain(s.title);
    }
    expect(container.querySelector("#testimonials")).not.toBeNull();
    for (const t of defaultConfig.testimonials) {
      expect(html).toContain(t.name);
    }
    expect(html).toContain("Ready for a cleaner home?");
    expect(html).toContain("What we can do for you");
    expect(html).toContain("What clients say");
    expect(container.querySelectorAll("h1").length).toBe(1);
  });

  it("home hero eyebrow uses serviceArea city, uppercased", () => {
    root = mountAt("/", <HomePage />, container);
    const eyebrow = container.querySelector(".eyebrow");
    expect(eyebrow?.textContent).toContain(
      serviceAreaCity(defaultConfig.business.serviceArea).toUpperCase(),
    );
  });

  it("services page renders one card per service with included items", () => {
    root = mountAt("/services", <ServicesPage />, container);
    const html = container.innerHTML;
    expect(html).toContain("Every clean comes with our full attention");
    expect(html).toContain("Every home is different.");
    for (const s of defaultConfig.services) {
      expect(html).toContain(s.title);
      for (const inc of s.included) {
        expect(html).toContain(inc);
      }
    }
    expect(container.querySelectorAll("h1").length).toBe(1);
  });

  it("quote page has tel:, sms:, mailto:, and facebook links", () => {
    root = mountAt("/quote", <QuotePage />, container);
    const links = Array.from(container.querySelectorAll("a"));
    const hrefs = links.map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.some((h) => h.startsWith("tel:"))).toBe(true);
    expect(hrefs.some((h) => h.startsWith("sms:"))).toBe(true);
    expect(hrefs.some((h) => h.startsWith("mailto:"))).toBe(true);
    expect(container.innerHTML).toContain("Prefer email?");
    expect(container.innerHTML).toContain(
      "To speed up your quote, tell us:",
    );
    expect(container.querySelectorAll("h1").length).toBe(1);
    const fbLink = links.find((a) =>
      (a.getAttribute("aria-label") ?? "").startsWith("Message us on Facebook"),
    );
    expect(fbLink?.getAttribute("target")).toBe("_blank");
    expect(fbLink?.getAttribute("rel") ?? "").toContain("noopener");
  });
});
