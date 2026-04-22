import { hero, itLearns } from "@/lib/copy";

export function ItLearns() {
  const accent = hero.autonomousAccent;

  return (
    <section
      className="w-full bg-[var(--bg)] px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="it-learns-headline"
    >
      <div className="mx-auto max-w-6xl text-center">
        <h2
          id="it-learns-headline"
          className="font-display font-bold leading-[1.08] tracking-tight text-black [font-size:clamp(44px,6vw,80px)]"
        >
          {itLearns.headlineBefore}
          <span style={{ color: accent }} className="font-inherit leading-[1.08]">
            {itLearns.headlineAccent}
          </span>
          .
        </h2>
        <p className="mx-auto mt-6 max-w-3xl font-light leading-snug tracking-tight text-[#404040] [font-size:clamp(17px,2.1vw,24px)] sm:mt-8">
          {itLearns.subhead}
        </p>
      </div>
    </section>
  );
}
