export const SUGGESTED_TAGS = [
  "Schlaf",
  "Angst",
  "Arbeit",
  "Beziehung",
  "Familie",
  "Körper",
  "Stress",
  "Freude",
  "Bewegung",
  "Einsamkeit",
] as const;

export const MOOD_LABELS: Record<number, string> = {
  1: "sehr schwer",
  2: "schwer",
  3: "eher schlecht",
  4: "gedrückt",
  5: "mittel",
  6: "okay",
  7: "ganz gut",
  8: "gut",
  9: "sehr gut",
  10: "ausgezeichnet",
};

export const EXERCISE_CATEGORIES = [
  "Atmung",
  "Erdung",
  "Entspannung",
  "Imagination",
  "Gedanken & Gefühle",
  "Aktivierung",
  "Achtsamkeit",
  "Selbstfürsorge",
] as const;

export const EMERGENCY_NUMBERS = [
  { number: "112", label: "Notruf", description: "Euro-Notruf, europaweit gültig" },
  { number: "144", label: "Rettung", description: "Medizinischer Notfall" },
  { number: "142", label: "TelefonSeelsorge", description: "Rund um die Uhr, kostenlos, anonym" },
] as const;
