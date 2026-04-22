import { hero, itLearns } from "@/lib/copy";

/** Superscript * after accent word — same as Hero H1 (autonomous*) */
const H2_ACCENT_ASTERISK_STYLE = {
  color: "#FF7B9C",
  fontSize: "clamp(17.6px, 2.4vw, 32px)",
  verticalAlign: "super" as const,
  lineHeight: 0,
  position: "relative" as const,
  top: "-0.3em",
};

export function ItLearns() {
  const accent = hero.autonomousAccent;

  return (
    <section
      className="w-full bg-[var(--bg)] px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="it-learns-headline"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)] sm:mb-5 sm:text-sm">
          {itLearns.eyebrow}
        </p>
        <h2
          id="it-learns-headline"
          className="font-display font-bold leading-[1.08] tracking-tight text-black [font-size:clamp(44px,6vw,80px)]"
        >
          {itLearns.headlineBefore}
          <span style={{ color: accent }} className="font-inherit leading-[1.08]">
            {itLearns.headlineAccent}
          </span>
          <span style={H2_ACCENT_ASTERISK_STYLE} className="font-display font-normal not-italic">
            *
          </span>
          .
        </h2>
        <p className="mx-auto mt-6 max-w-3xl font-light leading-snug tracking-tight text-[#404040] [font-size:clamp(17px,2.1vw,24px)] sm:mt-8">
          {itLearns.subhead}
        </p>
        <p className="mx-auto mt-3 max-w-md text-center text-[12px] font-normal leading-snug text-[#999] sm:mt-4">
          <span
            className="font-display align-baseline font-normal not-italic"
            style={{ color: "#FF7B9C", fontSize: "12px" }}
          >
            *
          </span>
          <span className="italic"> {itLearns.footnote}</span>
        </p>
      </div>
    </section>
  );
}
