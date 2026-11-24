// Kleine, strikte Helfer zum Auslesen von Formularfeldern in Server Actions.

export function str(form: FormData, name: string, maxLength = 10_000): string {
  const v = form.get(name);
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLength);
}

export function int(form: FormData, name: string): number | null {
  const v = form.get(name);
  if (typeof v !== "string" || !/^-?\d+$/.test(v.trim())) return null;
  return Number.parseInt(v, 10);
}

export function bool(form: FormData, name: string): boolean {
  const v = form.get(name);
  return v === "on" || v === "true" || v === "1";
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function uuid(form: FormData, name: string): string | null {
  const v = form.get(name);
  return isUuid(v) ? v : null;
}

/** Nur interne, relative Pfade als Weiterleitungsziel zulassen. */
export function safeRedirectPath(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
