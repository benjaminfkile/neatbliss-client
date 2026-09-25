import { useNavigate } from "react-router-dom";
import { useConfig } from "../config/ConfigProvider";
import { ADMIN_ROUTE } from "../routes";
import styles from "./PreviewPill.module.css";

export function PreviewPill() {
  const { source, clearDraft } = useConfig();
  const navigate = useNavigate();

  if (source !== "draft") return null;

  return (
    <div className={styles.wrap} role="region" aria-label="Previewing draft settings">
      <span className={styles.label}>Previewing your changes</span>
      <button
        type="button"
        className={styles.action}
        onClick={() => navigate(ADMIN_ROUTE)}
      >
        Back to editing
      </button>
      <button type="button" className={styles.discard} onClick={clearDraft}>
        Discard
      </button>
    </div>
  );
}
