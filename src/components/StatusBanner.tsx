import { useConfig } from "../config/ConfigProvider";
import styles from "./StatusBanner.module.css";

export function StatusBanner() {
  const { config } = useConfig();
  const { enabled, message } = config.status;
  if (!enabled || message.trim().length === 0) return null;

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <svg
        className={styles.icon}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r="0.6" fill="currentColor" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
