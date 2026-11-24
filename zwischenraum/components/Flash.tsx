import { getMessage } from "@/lib/messages";

const STYLES = {
  success: "bg-sage-50 text-sage-700 ring-sage-100",
  error: "bg-clay-50 text-clay-800 ring-clay-100",
  info: "bg-sky-50 text-sky-700 ring-sky-50",
} as const;

/** Zeigt eine Rückmeldung zu ?m=<schlüssel> an (nur bekannte Schlüssel). */
export function Flash({ code }: { code: string | string[] | undefined }) {
  const message = getMessage(code);
  if (!message) return null;
  return (
    <div
      role={message.kind === "error" ? "alert" : "status"}
      className={`mb-5 rounded-xl px-4 py-3 ring-1 ${STYLES[message.kind]}`}
    >
      {message.text}
    </div>
  );
}
