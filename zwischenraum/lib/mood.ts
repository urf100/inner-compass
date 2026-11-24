import { lastNDays } from "@/lib/dates";

export interface MoodPoint {
  date: string;
  mood: number; // Tagesdurchschnitt
  count: number;
}

/** Tagesdurchschnitt der Stimmung für die letzten `days` Tage. */
export function dailyMood(entries: { entry_date: string; mood: number }[], days = 30): MoodPoint[] {
  const range = lastNDays(days);
  const inRange = new Set(range);
  const sums = new Map<string, { sum: number; count: number }>();
  for (const e of entries) {
    if (!inRange.has(e.entry_date)) continue;
    const s = sums.get(e.entry_date) ?? { sum: 0, count: 0 };
    s.sum += e.mood;
    s.count += 1;
    sums.set(e.entry_date, s);
  }
  return range
    .filter((d) => sums.has(d))
    .map((d) => {
      const s = sums.get(d)!;
      return { date: d, mood: Math.round((s.sum / s.count) * 10) / 10, count: s.count };
    });
}

export type Trend = "steigend" | "stabil" | "sinkend" | "unbekannt";

/**
 * Einfacher, bewusst vorsichtiger Trend: Durchschnitt der letzten 7 Tage im
 * Vergleich zu den 23 Tagen davor (innerhalb von 30 Tagen).
 */
export function moodTrend(points: MoodPoint[]): { trend: Trend; recent: number | null } {
  if (points.length === 0) return { trend: "unbekannt", recent: null };
  const days = lastNDays(30);
  const cutoff = days[days.length - 7];
  const recent = points.filter((p) => p.date >= cutoff);
  const earlier = points.filter((p) => p.date < cutoff);
  const avg = (ps: MoodPoint[]) => ps.reduce((a, p) => a + p.mood, 0) / ps.length;
  const recentAvg = recent.length ? Math.round(avg(recent) * 10) / 10 : null;
  if (!recent.length || !earlier.length) return { trend: "unbekannt", recent: recentAvg };
  const diff = avg(recent) - avg(earlier);
  if (diff >= 1) return { trend: "steigend", recent: recentAvg };
  if (diff <= -1) return { trend: "sinkend", recent: recentAvg };
  return { trend: "stabil", recent: recentAvg };
}
