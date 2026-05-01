import Link from "next/link";

import { HOME_PAGE_CONTAINER_CLASS } from "@/components/sections/home/home-layout";
import { H1 } from "@/components/ui/Headings";

/**
 * H1 line breaks per Figma v3 desktop visual (3 lines). Node `428:16741` stores a
 * single U+2028; browser wrapping did not match the frame — explicit `\n` matches Tristan’s spec.
 */
const HERO_TITLE = "The OpenClaw cofounder\nthat makes your\ncompany autonomous";

/** Line 2 must start with “than you” (Figma wrap); explicit `\n` after “better”. */
const HERO_SUB =
  "Pancake gets you a cofounder that knows your company better\nthan you and handles 50% of the job.";

export function HomeHero() {
  return (
    <section
      className="home-hero relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div
        className={`${HOME_PAGE_CONTAINER_CLASS} grid grid-cols-1 pt-[var(--spacing-home-hero-padding-top-mobile)] pb-[var(--spacing-xxl)] lg:grid-cols-[minmax(0,9fr)_minmax(0,3fr)] lg:gap-x-[var(--spacing-xxl)] lg:pt-[var(--spacing-home-hero-padding-top)] lg:pb-[var(--spacing-xxl)]`}
        style={{ rowGap: "var(--spacing-xl)" }}
      >
        <div className="home-hero-text-stack relative z-[1] lg:pr-[var(--spacing-md)]">
          <H1 className="whitespace-pre-line">{HERO_TITLE}</H1>
          <p className="home-hero-body whitespace-pre-line">{HERO_SUB}</p>
          <div className="home-hero-cta-row">
            <Link
              href="/signup"
              className="button inline-flex w-fit shrink-0 items-center justify-center no-underline"
              data-size="lg"
              prefetch={false}
            >
              Try for free
            </Link>
            <p className="home-hero-cta-note shrink-0">No credit card needed</p>
          </div>
        </div>

        {/* Illustration column: stripped for step-by-step rebuild (no SVG / stack / glow). */}
        <div className="hidden min-h-0 select-none lg:block" aria-hidden />
      </div>
    </section>
  );
}
