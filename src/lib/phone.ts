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

function usDigits(phone: string): string | null {
  const trimmed = phone.trim();
  if (/[^\d\s().+-]/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return null;
}

export function isValidUsPhone(phone: string): boolean {
  return usDigits(phone) !== null;
}

/**
 * Formats a valid US number as (406) 450-4247. Anything else is returned
 * unchanged so typing is never interrupted.
 */
export function formatUsPhone(phone: string): string {
  const digits = usDigits(phone);
  if (!digits) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
