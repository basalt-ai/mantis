import { safeCompliant } from "@/lib/copy";

const iconClass = "h-8 w-8 text-[var(--accent)]";

function HumanApprovalIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        opacity={0.9}
      />
    </svg>
  );
}

function AuditLogIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
      <path
        fill="currentColor"
        d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
        opacity={0.9}
      />
    </svg>
  );
}

function ScopedAccessIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
      <path
        fill="currentColor"
        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
        opacity={0.9}
      />
    </svg>
  );
}

function SafeCompliantIcon({ kind }: { kind: "check" | "list" | "lock" }) {
  switch (kind) {
    case "check":
      return <HumanApprovalIcon />;
    case "list":
      return <AuditLogIcon />;
    case "lock":
      return <ScopedAccessIcon />;
  }
}

export function SafeCompliant() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          {safeCompliant.title}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {safeCompliant.badges.map((b) => (
            <div key={b.title} className="rounded-theme brut-border bg-[#c9b8ff] p-6 text-center">
              <div className="flex justify-center">
                <SafeCompliantIcon kind={b.icon} />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-[var(--text)]">
                {b.title}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm text-[var(--text-muted)]">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
