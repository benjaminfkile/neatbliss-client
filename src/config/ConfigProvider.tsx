import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { configSchema, defaultConfig, type SiteConfig } from "./schema";

export type ConfigSource = "live" | "draft" | "defaults";

interface ConfigContextValue {
  config: SiteConfig;
  source: ConfigSource;
  applyDraft: (next: SiteConfig) => void;
  clearDraft: () => void;
}

export const DRAFT_STORAGE_KEY = "neatbliss-draft";

const ConfigContext = createContext<ConfigContextValue | null>(null);

function readDraft(): SiteConfig | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = configSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const initialDraft = typeof window === "undefined" ? null : readDraft();
  const [config, setConfig] = useState<SiteConfig>(
    initialDraft ?? defaultConfig,
  );
  const [source, setSource] = useState<ConfigSource>(
    initialDraft ? "draft" : "defaults",
  );

  useEffect(() => {
    if (initialDraft) return;
    let cancelled = false;
    const url = `${import.meta.env.BASE_URL}config.json`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`fetch failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const parsed = configSchema.safeParse(data);
        if (!parsed.success) {
          throw new Error(`config.json failed validation: ${parsed.error.message}`);
        }
        if (!cancelled) {
          setConfig(parsed.data);
          setSource("live");
        }
      })
      .catch((err) => {
        console.warn(
          "ConfigProvider falling back to defaults:",
          err instanceof Error ? err.message : err,
        );
        if (!cancelled) {
          setConfig(defaultConfig);
          setSource("defaults");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [initialDraft]);

  const applyDraft = useCallback((next: SiteConfig) => {
    try {
      window.localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify(next, null, 2) + "\n",
      );
    } catch {
      // ignore write failures; still show the draft in-memory
    }
    setConfig(next);
    setSource("draft");
  }, []);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setConfig(defaultConfig);
    setSource("defaults");
    const url = `${import.meta.env.BASE_URL}config.json`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`status ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const parsed = configSchema.safeParse(data);
        if (parsed.success) {
          setConfig(parsed.data);
          setSource("live");
        }
      })
      .catch(() => {
        // stay on defaults
      });
  }, []);

  const value = useMemo<ConfigContextValue>(
    () => ({ config, source, applyDraft, clearDraft }),
    [config, source, applyDraft, clearDraft],
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useConfig must be used inside a ConfigProvider");
  }
  return ctx;
}
