// Datums-Hilfen. Gespeichert wird in UTC, angezeigt in österreichischer Zeit.

export const TIME_ZONE = "Europe/Vienna";

const isoDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Kalenderdatum (YYYY-MM-DD) eines Zeitpunkts in Wien. */
export function viennaDate(value: Date | string = new Date()): string {
  return isoDateFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function todayInVienna(): string {
  return viennaDate(new Date());
}

/** Addiert Tage zu einem Kalenderdatum (YYYY-MM-DD). */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days, 12));
  return t.toISOString().slice(0, 10);
}

/** Die letzten n Kalendertage bis einschließlich heute (älteste zuerst). */
export function lastNDays(n: number, end = todayInVienna()): string[] {
  return Array.from({ length: n }, (_, i) => addDays(end, i - (n - 1)));
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

export function isValidTimeString(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function viennaOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - utcMs;
}

/** Wandelt Datum + Uhrzeit in Wiener Ortszeit in einen UTC-Zeitpunkt um. */
export function viennaLocalToUtc(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const wallClock = Date.UTC(y, m - 1, d, hh, mm);
  let ts = wallClock - viennaOffsetMs(wallClock);
  const corrected = wallClock - viennaOffsetMs(ts);
  if (corrected !== ts) ts = corrected;
  return new Date(ts);
}

/** "Montag, 24. November 2026" für ein Kalenderdatum. */
export function formatDateLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

/** "Mo., 24. Nov." für ein Kalenderdatum. */
export function formatDateShort(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

/** "24.11." für Diagramm-Achsen. */
export function formatDayMonth(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${d}.${m}.`;
}

/** "Mo., 24. Nov. 2026, 14:00" für einen Zeitpunkt. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "14:00" */
export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** "heute", "gestern", "vor 3 Tagen", sonst Datum. */
export function formatRelativeDay(iso: string): string {
  const day = viennaDate(iso);
  const today = todayInVienna();
  if (day === today) return "heute";
  if (day === addDays(today, -1)) return "gestern";
  for (let i = 2; i <= 13; i++) {
    if (day === addDays(today, -i)) return `vor ${i} Tagen`;
  }
  return formatDateShort(day);
}

export function hoursUntil(iso: string): number {
  return (new Date(iso).getTime() - Date.now()) / 3_600_000;
}
