import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ConfigProvider, useConfig } from "./ConfigProvider";
import { defaultConfig } from "./schema";

interface Snapshot {
  configName: string;
  source: string;
}

function Probe({ onSnapshot }: { onSnapshot: (s: Snapshot) => void }) {
  const { config, source } = useConfig();
  onSnapshot({ configName: config.business.name, source });
  return null;
}

describe("ConfigProvider", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  it("falls back to defaults when fetch rejects, with a console.warn", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("network down"))),
    );

    const snapshots: Snapshot[] = [];
    await act(async () => {
      root.render(
        <ConfigProvider>
          <Probe onSnapshot={(s) => snapshots.push(s)} />
        </ConfigProvider>,
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    const last = snapshots[snapshots.length - 1];
    expect(last.source).toBe("defaults");
    expect(last.configName).toBe(defaultConfig.business.name);
    expect(warn).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
