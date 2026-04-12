import Link from "next/link";
import { finalCta, hero } from "@/lib/copy";

export function FinalCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          {finalCta.title}
        </h2>
        <p className="mt-4 text-lg text-[var(--text-muted)]">{finalCta.subtitle}</p>
        <div className="mt-10">
          <Link
            href="/signup"
            style={{ backgroundColor: hero.autonomousAccent }}
            className="inline-flex rounded-theme brut-border px-10 py-4 text-base font-semibold !text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            {finalCta.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
