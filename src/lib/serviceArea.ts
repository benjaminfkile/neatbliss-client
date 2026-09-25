export function serviceAreaCity(serviceArea: string): string {
  const trimmed = serviceArea.trim();
  const cutoff = trimmed.toLowerCase().indexOf(" and ");
  if (cutoff === -1) return trimmed;
  return trimmed.slice(0, cutoff).trim();
}
