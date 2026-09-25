function sanitize(phone: string): string {
  const trimmed = phone.trim();
  const leadingPlus = trimmed.startsWith("+") ? "+" : "";
  return leadingPlus + trimmed.replace(/\D/g, "");
}

export function telHref(phone: string): string {
  return `tel:${sanitize(phone)}`;
}

export function smsHref(phone: string): string {
  return `sms:${sanitize(phone)}`;
}
