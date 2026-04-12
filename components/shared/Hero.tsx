import Link from "next/link";
import { hero } from "@/lib/copy";

/** H1 superscript * — proportional to headline clamp */
const H1_ASTERISK_STYLE = {
  color: "#FF7B9C",
  fontSize: "clamp(17.6px, 2.4vw, 32px)",
  verticalAlign: "super" as const,
  lineHeight: 0,
  position: "relative" as const,
  top: "-0.3em",
};

export function Hero() {
  const accent = hero.autonomousAccent;

  return (
    <section className="relative px-4 pb-14 pt-[calc(4.5rem+5.5rem)] sm:px-6 sm:pt-[calc(4.5rem+6.25rem)]">
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="font-display font-bold leading-[1.08] tracking-tight text-black [font-size:clamp(44px,6vw,80px)]">
          {hero.h1Before}
          <br />
          <span style={{ color: accent }} className="font-inherit leading-[1.08]">
            autonomous
          </span>
          <span style={H1_ASTERISK_STYLE} className="font-display font-normal not-italic">
            *
          </span>
          {hero.h1After}
        </h1>

        <p className="mx-auto mt-6 max-w-3xl font-light leading-snug tracking-tight text-[#404040] [font-size:clamp(17px,2.1vw,24px)] sm:mt-8">
          {hero.h2}
        </p>

        <div className="mt-6 flex justify-center px-1 sm:mt-7">
          <Link
            href="/signup"
            style={{ backgroundColor: accent }}
            className="inline-flex max-w-full rounded-theme brut-border px-4 py-2.5 text-center text-[0.7rem] font-semibold leading-snug !text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5 sm:px-6 sm:text-xs md:text-sm"
          >
            {hero.cta}
          </Link>
        </div>

        <p
          id={hero.humanBoardAnchorId}
          className="mx-auto mt-3 max-w-md scroll-mt-28 text-center text-[12px] font-normal leading-snug text-[#999] sm:mt-4"
        >
          <span
            className="font-display align-baseline font-normal not-italic"
            style={{ color: "#FF7B9C", fontSize: "12px" }}
          >
            *
          </span>
          <span className="italic"> {hero.h3}</span>
        </p>
      </div>
    </section>
  );
}
