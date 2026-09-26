import { useConfig } from "../config/ConfigProvider";
import styles from "./StatusBanner.module.css";

export function StatusBanner() {
  const { config } = useConfig();
  const { enabled, message } = config.status;
  if (!enabled || message.trim().length === 0) return null;

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span className={styles.iconCircle} aria-hidden="true">
        <svg
          className={styles.icon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11v2a1 1 0 0 0 1 1h2l6 4V6L6 10H4a1 1 0 0 0-1 1z" />
          <path d="M16 8a5 5 0 0 1 0 8" />
          <path d="M19 5a9 9 0 0 1 0 14" />
        </svg>
      </span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
