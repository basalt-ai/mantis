import { safeCompliant } from "@/lib/copy";

function DiamondIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-[var(--accent)]" aria-hidden>
      <path
        fill="currentColor"
        d="M16 2 30 16 16 30 2 16 16 2Zm0 4.8L5.2 16 16 26.8 26.8 16 16 6.8Z"
        opacity={0.9}
      />
    </svg>
  );
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
                <DiamondIcon />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-[var(--text)]">
                {b.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
