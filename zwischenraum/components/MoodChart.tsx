import { formatDateShort, formatDayMonth, lastNDays } from "@/lib/dates";
import type { MoodPoint } from "@/lib/mood";

/**
 * Einfaches, barrierearmes Liniendiagramm (reines SVG, kein JavaScript).
 * Für Screenreader gibt es zusätzlich eine Tabelle mit allen Werten.
 */
export function MoodChart({
  points,
  days = 30,
  title = "Stimmungsverlauf der letzten 30 Tage",
  compact = false,
}: {
  points: MoodPoint[];
  days?: number;
  title?: string;
  compact?: boolean;
}) {
  const range = lastNDays(days);
  const W = compact ? 160 : 400;
  const H = compact ? 44 : 190;
  const pad = compact ? { l: 4, r: 4, t: 4, b: 4 } : { l: 28, r: 10, t: 10, b: 28 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const x = (date: string) => pad.l + (range.indexOf(date) / Math.max(days - 1, 1)) * innerW;
  const y = (mood: number) => pad.t + ((10 - mood) / 9) * innerH;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.date).toFixed(1)},${y(p.mood).toFixed(1)}`).join(" ");
  const id = `chart-${compact ? "c" : "f"}-${points.length}-${points[0]?.date ?? "leer"}`;

  if (compact) {
    if (points.length === 0) {
      return <span className="text-sm text-ink-soft">Noch keine geteilten Werte</span>;
    }
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={`Stimmung, letzte ${days} Tage: ${points.map((p) => `${formatDayMonth(p.date)} ${p.mood}`).join(", ")}`}
        className="max-w-full"
      >
        <line x1={pad.l} x2={W - pad.r} y1={y(5.5)} y2={y(5.5)} stroke="#e9e0d2" strokeDasharray="3 3" />
        {points.length > 1 && <path d={path} fill="none" stroke="#3d6a56" strokeWidth="2" strokeLinejoin="round" />}
        {points.map((p) => (
          <circle key={p.date} cx={x(p.date)} cy={y(p.mood)} r="2.5" fill="#3d6a56" />
        ))}
      </svg>
    );
  }

  return (
    <figure className="card" aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`} className="mb-3 font-semibold">
        {title}
      </figcaption>
      {points.length === 0 ? (
        <p className="py-8 text-center text-ink-soft">Noch keine Werte in den letzten {days} Tagen.</p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full max-w-2xl"
            role="img"
            aria-labelledby={`${id}-title ${id}-desc`}
          >
            <desc id={`${id}-desc`}>
              {points.length} Tage mit Einträgen. Stimmung zwischen {Math.min(...points.map((p) => p.mood))} und{" "}
              {Math.max(...points.map((p) => p.mood))} auf einer Skala von 1 bis 10.
            </desc>
            {[1, 4, 7, 10].map((v) => (
              <g key={v}>
                <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#e9e0d2" />
                <text x={pad.l - 7} y={y(v) + 4} textAnchor="end" fontSize="13" fill="#57504a">
                  {v}
                </text>
              </g>
            ))}
            {[0, Math.floor((days - 1) / 2), days - 1].map((i) => (
              <text
                key={i}
                x={x(range[i])}
                y={H - 8}
                textAnchor={i === 0 ? "start" : i === days - 1 ? "end" : "middle"}
                fontSize="13"
                fill="#57504a"
              >
                {formatDayMonth(range[i])}
              </text>
            ))}
            {points.length > 1 && (
              <path d={path} fill="none" stroke="#3d6a56" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            )}
            {points.map((p) => (
              <circle key={p.date} cx={x(p.date)} cy={y(p.mood)} r="3.5" fill="#fff" stroke="#3d6a56" strokeWidth="2.2" />
            ))}
          </svg>
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer font-semibold text-sage-700">Werte als Tabelle anzeigen</summary>
            <table className="mt-2 w-full text-left">
              <thead>
                <tr className="border-b border-sand-200">
                  <th scope="col" className="py-1 pr-4 font-semibold">
                    Datum
                  </th>
                  <th scope="col" className="py-1 font-semibold">
                    Stimmung (Ø)
                  </th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.date} className="border-b border-sand-100">
                    <td className="py-1 pr-4">{formatDateShort(p.date)}</td>
                    <td className="py-1">{p.mood.toLocaleString("de-AT")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </figure>
  );
}
