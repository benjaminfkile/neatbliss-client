import { configSchema, type SiteConfig } from "../config/schema";

export interface FormServiceState {
  id: string;
  title: string;
  description: string;
  included: string;
  icon: string;
}

export interface FormTestimonialState {
  id: string;
  quote: string;
  name: string;
}

export interface FormState {
  status: { enabled: boolean; message: string };
  business: SiteConfig["business"];
  services: FormServiceState[];
  testimonials: FormTestimonialState[];
  admin: { githubEditUrl: string };
}

let idCounter = 0;
export function newRowId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function configToForm(cfg: SiteConfig): FormState {
  return {
    status: { enabled: cfg.status.enabled, message: cfg.status.message },
    business: { ...cfg.business },
    services: cfg.services.map((s) => ({
      id: newRowId("s"),
      title: s.title,
      description: s.description,
      included: s.included.join("\n"),
      icon: s.icon ?? "",
    })),
    testimonials: cfg.testimonials.map((t) => ({
      id: newRowId("t"),
      quote: t.quote,
      name: t.name,
    })),
    admin: { githubEditUrl: cfg.admin.githubEditUrl },
  };
}

export function formToConfig(form: FormState): SiteConfig {
  return {
    status: { enabled: form.status.enabled, message: form.status.message },
    business: { ...form.business },
    services: form.services.map((s) => {
      const built: SiteConfig["services"][number] = {
        title: s.title,
        description: s.description,
        included: s.included
          .split("\n")
          .filter((line) => line.trim().length > 0),
      };
      if (s.icon) built.icon = s.icon;
      return built;
    }),
    testimonials: form.testimonials.map((t) => ({
      quote: t.quote,
      name: t.name,
    })),
    admin: { githubEditUrl: form.admin.githubEditUrl },
  };
}

export function serializeConfig(cfg: SiteConfig): string {
  return JSON.stringify(cfg, null, 2) + "\n";
}

export function emptyService(): FormServiceState {
  return {
    id: newRowId("s"),
    title: "",
    description: "",
    included: "",
    icon: "calendar",
  };
}

export function emptyTestimonial(): FormTestimonialState {
  return {
    id: newRowId("t"),
    quote: "",
    name: "",
  };
}

export interface ValidatedForm {
  ok: true;
  config: SiteConfig;
  json: string;
}
export interface InvalidForm {
  ok: false;
  message: string;
}

export function validateForm(form: FormState): ValidatedForm | InvalidForm {
  const built = formToConfig(form);
  const parsed = configSchema.safeParse(built);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path.join(".") || "config";
    return { ok: false, message: `${path}: ${first?.message ?? "invalid"}` };
  }
  return { ok: true, config: parsed.data, json: serializeConfig(parsed.data) };
}
