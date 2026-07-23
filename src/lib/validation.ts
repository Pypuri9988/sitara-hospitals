export type ValidationResult = { valid: true } | { valid: false; error: string };

export function validatePhone(phone: string): boolean {
  const digits = (phone ?? "").replace(/\D/g, "");
  // Accept 10-digit Indian numbers, optionally with country code.
  return digits.length >= 10 && digits.length <= 13;
}

export function validateName(name: string): boolean {
  return typeof name === "string" && name.trim().length >= 2;
}

export function sanitize(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}
