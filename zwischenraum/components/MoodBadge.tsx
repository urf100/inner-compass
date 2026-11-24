import { MOOD_LABELS } from "@/lib/constants";

export function MoodBadge({ mood }: { mood: number }) {
  const tone =
    mood <= 3 ? "bg-clay-50 text-clay-800" : mood <= 6 ? "bg-honey-50 text-honey-800" : "bg-sage-50 text-sage-700";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold ${tone}`}>
      <span aria-hidden="true">●</span>
      Stimmung {mood}/10<span className="sr-only">: {MOOD_LABELS[mood]}</span>
    </span>
  );
}

export function TrendLabel({ trend }: { trend: "steigend" | "stabil" | "sinkend" | "unbekannt" }) {
  const map = {
    steigend: { text: "eher steigend", icon: "↗", cls: "text-sage-700" },
    stabil: { text: "stabil", icon: "→", cls: "text-ink-soft" },
    sinkend: { text: "eher sinkend", icon: "↘", cls: "text-clay-800" },
    unbekannt: { text: "zu wenig Daten", icon: "·", cls: "text-ink-soft" },
  } as const;
  const t = map[trend];
  return (
    <span className={`text-sm font-semibold ${t.cls}`}>
      <span aria-hidden="true">{t.icon} </span>
      Trend: {t.text}
    </span>
  );
}
