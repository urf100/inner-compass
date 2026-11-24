import type { CrisisContact, CrisisPlan } from "@/lib/types";

export const MAX_CONTACTS = 4;

export function normalizeContacts(value: unknown): CrisisContact[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((c): c is Record<string, unknown> => typeof c === "object" && c !== null)
    .map((c) => ({
      name: typeof c.name === "string" ? c.name : "",
      phone: typeof c.phone === "string" ? c.phone : "",
      note: typeof c.note === "string" ? c.note : "",
    }))
    .filter((c) => c.name || c.phone)
    .slice(0, MAX_CONTACTS);
}

export function normalizePlan(plan: CrisisPlan | null): CrisisPlan | null {
  if (!plan) return null;
  return { ...plan, contacts: normalizeContacts(plan.contacts) };
}

/** Für tel:-Links nur Ziffern und ein führendes + zulassen. */
export function telHref(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  return cleaned.length >= 3 ? `tel:${cleaned}` : null;
}

export function isPlanEmpty(plan: CrisisPlan | null) {
  return !plan || (!plan.warning_signs.trim() && !plan.helpful_actions.trim() && plan.contacts.length === 0);
}
