import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./StatusNoticeModal.module.css";

export const NOTICE_STORAGE_KEY = "neatbliss-notice-seen";

interface StatusNoticeModalProps {
  enabled: boolean;
  message: string;
  disabled?: boolean;
}

function readSeen(): string | null {
  try {
    return window.sessionStorage.getItem(NOTICE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeSeen(message: string): void {
  try {
    window.sessionStorage.setItem(NOTICE_STORAGE_KEY, message);
  } catch {
    // ignore
  }
}

export function StatusNoticeModal({
  enabled,
  message,
  disabled = false,
}: StatusNoticeModalProps) {
  const headingId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const shouldShow =
    !disabled && enabled && message.trim().length > 0;

  const [open, setOpen] = useState<boolean>(false);
  const [sessionDismissed, setSessionDismissed] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldShow) {
      setOpen(false);
      return;
    }
    if (sessionDismissed === message) {
      setOpen(false);
      return;
    }
    const seen = readSeen();
    setOpen(seen !== message);
  }, [shouldShow, message, sessionDismissed]);

  const close = useCallback(() => {
    writeSeen(message);
    setSessionDismissed(message);
    setOpen(false);
  }, [message]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = window.requestAnimationFrame(() => {
      buttonRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      const toRestore = restoreFocusRef.current;
      if (toRestore && typeof toRestore.focus === "function") {
        toRestore.focus();
      }
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={messageId}
        className={styles.card}
      >
        <span className={styles.iconCircle} aria-hidden="true">
          <svg
            width="22"
            height="22"
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
        <h2 id={headingId} className={styles.heading}>
          A quick note
        </h2>
        <p id={messageId} className={styles.message}>
          {message}
        </p>
        <button
          ref={buttonRef}
          type="button"
          className={`pill pill--green ${styles.action}`}
          onClick={close}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
