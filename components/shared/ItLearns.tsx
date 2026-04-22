import { itLearns } from "@/lib/copy";

export function ItLearns() {
  return (
    <section
      className="w-full bg-[#0a0a0a] px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="it-learns-headline"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)] sm:mb-5 sm:text-sm">
          {itLearns.eyebrow}
        </p>
        <h2
          id="it-learns-headline"
          className="font-display font-bold leading-[1.08] tracking-tight text-[var(--bg)] [font-size:clamp(44px,6vw,80px)]"
        >
          {itLearns.headlineLead}
          <span className="text-[var(--accent)]">{itLearns.headlineAccent}</span>
          .
        </h2>
        <p className="mx-auto mt-6 max-w-2xl font-light leading-snug tracking-tight text-[var(--bg)] [font-size:clamp(17px,2.1vw,24px)] sm:mt-8">
          {itLearns.subhead}
        </p>
      </div>
    </section>
  );
}
