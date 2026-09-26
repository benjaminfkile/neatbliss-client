import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfig } from "../config/ConfigProvider";
import {
  EMAIL_MESSAGE,
  PHONE_MESSAGE,
  isPlaceholder,
  isValidEmail,
} from "../config/schema";
import { formatUsPhone, isValidUsPhone } from "../lib/phone";
import {
  configToForm,
  emptyService,
  emptyTestimonial,
  validateForm,
  type FormState,
} from "./Admin.helpers";
import styles from "./Admin.module.css";

const PRESET_MESSAGES = [
  "Not accepting new clients right now",
  "Only monthly deep cleans available",
  "Booked out until [MONTH]",
];

const COPY_RESET_MS = 1600;

type CopyState = "idle" | "copied" | "fallback";

export function AdminPage() {
  const { config, source, applyDraft } = useConfig();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(() => configToForm(config));
  const initializedFromLoaded = useRef(source !== "defaults");

  useEffect(() => {
    if (initializedFromLoaded.current) return;
    if (source !== "defaults") {
      setForm(configToForm(config));
      initializedFromLoaded.current = true;
    }
  }, [source, config]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [fallbackText, setFallbackText] = useState<string>("");
  const fallbackRef = useRef<HTMLTextAreaElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!errorMessage) return;
    if (validateForm(form).ok) {
      setErrorMessage(null);
    }
  }, [form, errorMessage]);

  useEffect(() => {
    if (copyState !== "copied") return;
    const t = window.setTimeout(() => setCopyState("idle"), COPY_RESET_MS);
    return () => window.clearTimeout(t);
  }, [copyState]);

  function updateStatus(patch: Partial<FormState["status"]>) {
    setForm((prev) => ({ ...prev, status: { ...prev.status, ...patch } }));
  }

  function updateBusiness(patch: Partial<FormState["business"]>) {
    setForm((prev) => ({ ...prev, business: { ...prev.business, ...patch } }));
  }

  function updateAdmin(patch: Partial<FormState["admin"]>) {
    setForm((prev) => ({ ...prev, admin: { ...prev.admin, ...patch } }));
  }

  function patchService(index: number, patch: Partial<FormState["services"][number]>) {
    setForm((prev) => {
      const next = prev.services.slice();
      next[index] = { ...next[index], ...patch };
      return { ...prev, services: next };
    });
  }

  function addService() {
    setForm((prev) => ({ ...prev, services: [...prev.services, emptyService()] }));
  }

  function removeService(index: number) {
    setForm((prev) => {
      if (prev.services.length <= 1) return prev;
      const next = prev.services.slice();
      next.splice(index, 1);
      return { ...prev, services: next };
    });
  }

  function patchTestimonial(
    index: number,
    patch: Partial<FormState["testimonials"][number]>,
  ) {
    setForm((prev) => {
      const next = prev.testimonials.slice();
      next[index] = { ...next[index], ...patch };
      return { ...prev, testimonials: next };
    });
  }

  function addTestimonial() {
    setForm((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, emptyTestimonial()],
    }));
  }

  function removeTestimonial(index: number) {
    setForm((prev) => {
      const next = prev.testimonials.slice();
      next.splice(index, 1);
      return { ...prev, testimonials: next };
    });
  }

  function handlePreview() {
    const result = validateForm(form);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage(null);
    applyDraft(result.config);
    navigate("/");
  }

  async function handleCopy() {
    const result = validateForm(form);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage(null);
    const text = result.json;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error("clipboard unavailable");
      }
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setFallbackText(text);
      setCopyState("fallback");
      window.setTimeout(() => {
        const el = fallbackRef.current;
        if (el) {
          el.focus();
          el.select();
        }
      }, 0);
    }
  }

  function handleDownload() {
    const result = validateForm(form);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage(null);
    const blob = new Blob([result.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleOpenGitHub() {
    const href = form.admin.githubEditUrl;
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const copyLabel =
    copyState === "copied" ? "Copied!" : "Copy my settings";
  const lastServiceOnly = form.services.length <= 1;

  const phoneFieldError = (value: string) =>
    isPlaceholder(value) || isValidUsPhone(value) ? undefined : PHONE_MESSAGE;
  const emailFieldError = (value: string) =>
    isPlaceholder(value) || isValidEmail(value) ? undefined : EMAIL_MESSAGE;

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <h1 className={styles.topTitle}>NeatBliss site settings</h1>
          <p className={styles.topHint}>
            This page is private. Bookmark it so you can find it again.
          </p>
        </div>
      </header>

      <ol className={styles.steps} aria-label="How this works">
        <li>
          <span className={styles.stepNumber}>1</span>
          <span>Make your changes below</span>
        </li>
        <li>
          <span className={styles.stepNumber}>2</span>
          <span>Preview to make sure it looks right</span>
        </li>
        <li>
          <span className={styles.stepNumber}>3</span>
          <span>Copy your settings and paste them into GitHub</span>
        </li>
      </ol>

      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="card-status">
          <h2 id="card-status" className={styles.cardTitle}>
            Message at the top of the site
          </h2>
          <label className={styles.toggleRow}>
            <span className={styles.toggleLabel}>
              {form.status.enabled ? "Showing" : "Hidden"}
            </span>
            <button
              type="button"
              className={`${styles.toggle} ${
                form.status.enabled ? styles.toggleOn : ""
              }`}
              role="switch"
              aria-checked={form.status.enabled}
              aria-label="Show message at the top of the site"
              onClick={() =>
                updateStatus({ enabled: !form.status.enabled })
              }
            >
              <span className={styles.toggleKnob} aria-hidden="true" />
            </button>
          </label>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="status-message">
              MESSAGE
            </label>
            <textarea
              id="status-message"
              className={styles.textarea}
              rows={3}
              value={form.status.message}
              onChange={(e) => updateStatus({ message: e.target.value })}
              placeholder="Write a short note visitors will see at the top of every page."
            />
          </div>
          <p className={styles.help}>
            Use this when your schedule is full or anything else clients should
            know before they reach out. Turn it off and the site shows no
            message.
          </p>
          <div className={styles.presetRow} role="group" aria-label="Message presets">
            {PRESET_MESSAGES.map((preset) => (
              <button
                key={preset}
                type="button"
                className={styles.presetChip}
                onClick={() =>
                  updateStatus({ message: preset, enabled: true })
                }
              >
                {preset}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card} aria-labelledby="card-business">
          <h2 id="card-business" className={styles.cardTitle}>
            Business details
          </h2>
          <div className={styles.grid2}>
            <BusinessField
              label="BUSINESS NAME"
              value={form.business.name}
              onChange={(v) => updateBusiness({ name: v })}
            />
            <BusinessField
              label="TAGLINE"
              value={form.business.tagline}
              onChange={(v) => updateBusiness({ tagline: v })}
            />
            <BusinessField
              label="PHONE (CALLS)"
              value={form.business.phone}
              onChange={(v) => updateBusiness({ phone: v })}
              onBlur={() =>
                updateBusiness({ phone: formatUsPhone(form.business.phone) })
              }
              error={phoneFieldError(form.business.phone)}
            />
            <BusinessField
              label="PHONE (TEXTS)"
              value={form.business.textNumber}
              onChange={(v) => updateBusiness({ textNumber: v })}
              onBlur={() =>
                updateBusiness({
                  textNumber: formatUsPhone(form.business.textNumber),
                })
              }
              error={phoneFieldError(form.business.textNumber)}
            />
            <BusinessField
              label="EMAIL"
              value={form.business.email}
              onChange={(v) => updateBusiness({ email: v })}
              error={emailFieldError(form.business.email)}
            />
            <BusinessField
              label="FACEBOOK PAGE LINK"
              value={form.business.facebookUrl}
              onChange={(v) => updateBusiness({ facebookUrl: v })}
            />
            <BusinessField
              label="SERVICE AREA"
              value={form.business.serviceArea}
              onChange={(v) => updateBusiness({ serviceArea: v })}
              full
            />
            <BusinessField
              label="GITHUB EDIT URL"
              value={form.admin.githubEditUrl}
              onChange={(v) => updateAdmin({ githubEditUrl: v })}
              full
            />
          </div>
        </section>

        <section className={styles.card} aria-labelledby="card-services">
          <h2 id="card-services" className={styles.cardTitle}>
            Services
          </h2>
          <div className={styles.rowList}>
            {form.services.map((service, index) => (
              <div key={service.id} className={styles.row}>
                <div className={styles.rowHeader}>
                  <span className={styles.rowIndex}>Service {index + 1}</span>
                  <button
                    type="button"
                    className={styles.trashBtn}
                    onClick={() => removeService(index)}
                    disabled={lastServiceOnly}
                    aria-label={`Remove service ${index + 1}`}
                    title={
                      lastServiceOnly
                        ? "At least one service is required"
                        : "Remove this service"
                    }
                  >
                    <TrashIcon />
                  </button>
                </div>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>TITLE</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={service.title}
                    onChange={(e) =>
                      patchService(index, { title: e.target.value })
                    }
                  />
                </label>
                <div className={styles.field}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor={`service-description-${service.id}`}
                  >
                    DESCRIPTION
                  </label>
                  <textarea
                    id={`service-description-${service.id}`}
                    className={styles.textarea}
                    rows={3}
                    value={service.description}
                    onChange={(e) =>
                      patchService(index, { description: e.target.value })
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor={`service-included-${service.id}`}
                  >
                    INCLUDED
                  </label>
                  <textarea
                    id={`service-included-${service.id}`}
                    className={styles.textarea}
                    rows={4}
                    value={service.included}
                    onChange={(e) =>
                      patchService(index, { included: e.target.value })
                    }
                    placeholder="One item per line."
                  />
                  <span className={styles.help}>One item per line.</span>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={addService}
            >
              + Add a service
            </button>
          </div>
        </section>

        <section className={styles.card} aria-labelledby="card-testimonials">
          <h2 id="card-testimonials" className={styles.cardTitle}>
            Testimonials
          </h2>
          <p className={styles.help}>
            Copy reviews word for word from your Facebook page.
          </p>
          <div className={styles.rowList}>
            {form.testimonials.map((t, index) => (
              <div key={t.id} className={styles.row}>
                <div className={styles.rowHeader}>
                  <span className={styles.rowIndex}>Review {index + 1}</span>
                  <button
                    type="button"
                    className={styles.trashBtn}
                    onClick={() => removeTestimonial(index)}
                    aria-label={`Remove testimonial ${index + 1}`}
                    title="Remove this testimonial"
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div className={styles.field}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor={`testimonial-quote-${t.id}`}
                  >
                    QUOTE
                  </label>
                  <textarea
                    id={`testimonial-quote-${t.id}`}
                    className={styles.textarea}
                    rows={4}
                    value={t.quote}
                    onChange={(e) =>
                      patchTestimonial(index, { quote: e.target.value })
                    }
                  />
                </div>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>NAME</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={t.name}
                    onChange={(e) =>
                      patchTestimonial(index, { name: e.target.value })
                    }
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={addTestimonial}
            >
              + Add a testimonial
            </button>
          </div>
        </section>

        {errorMessage && (
          <div className={styles.errorNote} role="alert">
            {errorMessage}
          </div>
        )}

        {copyState === "fallback" && (
          <section className={styles.fallbackCard} aria-live="polite">
            <h3 className={styles.cardTitle}>Copy this JSON manually</h3>
            <p className={styles.help}>
              Your browser did not let us copy for you. Select all of the text
              below and copy it.
            </p>
            <textarea
              ref={fallbackRef}
              className={styles.fallbackText}
              readOnly
              value={fallbackText}
              rows={10}
            />
          </section>
        )}
      </main>

      <div className={styles.actionBar}>
        <div className={styles.actionBarInner}>
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={`pill pill--sky-outline ${styles.actionPill}`}
              onClick={handlePreview}
            >
              Preview my changes
            </button>
            <button
              type="button"
              className={`pill pill--green ${styles.actionPill}`}
              onClick={handleCopy}
            >
              {copyLabel}
            </button>
            <button
              type="button"
              className={`pill pill--navy ${styles.actionPill}`}
              onClick={handleOpenGitHub}
            >
              Open the settings file on GitHub
            </button>
            <button
              type="button"
              className={styles.downloadLink}
              onClick={handleDownload}
            >
              download the file instead
            </button>
          </div>
          <p className={styles.actionHelp}>
            After you copy: on the GitHub page, select everything in the file,
            paste over it, then press the green Commit changes button. The site
            updates about a minute later.
          </p>
        </div>
      </div>
    </div>
  );
}

interface BusinessFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  full?: boolean;
}

function BusinessField({
  label,
  value,
  onChange,
  onBlur,
  error,
  full,
}: BusinessFieldProps) {
  const errorId = `field-error-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className={`${styles.field} ${full ? styles.fieldFull : ""}`}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{label}</span>
        <input
          className={`${styles.input} ${error ? styles.inputInvalid : ""}`}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </label>
      {error && (
        <span id={errorId} className={styles.fieldError}>
          {error}
        </span>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable={false}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

