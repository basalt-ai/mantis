import Link from "next/link";

import { HOME_PAGE_CONTAINER_CLASS } from "@/components/sections/home/home-layout";
import { H1 } from "@/components/ui/Headings";

/**
 * H1 line breaks per Figma v3 desktop visual (3 lines). Node `428:16741` stores a
 * single U+2028; browser wrapping did not match the frame — explicit `\n` matches Tristan’s spec.
 */
const HERO_TITLE = "The OpenClaw cofounder\nthat makes your\ncompany autonomous";

/** Verbatim from desktop frame `428:16742`. */
const HERO_SUB =
  "Pancake gets you a cofounder that knows your company better than you and handles 50% of the job.";

export function HomeHero() {
  return (
    <section
      className="home-hero relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div
        className={`${HOME_PAGE_CONTAINER_CLASS} grid grid-cols-1 pt-[var(--spacing-xl)] pb-[var(--spacing-xxl)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-x-[var(--spacing-xxl)] lg:pt-[var(--spacing-xxl)] lg:pb-[var(--spacing-xxl)]`}
        style={{ rowGap: "var(--spacing-xl)" }}
      >
        <div className="relative z-[1] flex min-w-0 flex-col lg:pr-[var(--spacing-md)]" style={{ gap: "var(--spacing-xl)" }}>
          <H1 className="whitespace-pre-line">{HERO_TITLE}</H1>
          <p className="home-hero-body">{HERO_SUB}</p>
          <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            <Link
              href="/signup"
              className="button inline-flex w-fit items-center justify-center no-underline"
              data-size="lg"
              prefetch={false}
            >
              Try for free
            </Link>
            <p className="m-0" style={{ color: "var(--subtle-text)", fontSize: "var(--font-size-body-regular)" }}>
              No credit card needed
            </p>
          </div>
        </div>

        {/* Illustration column: stripped for step-by-step rebuild (no SVG / stack / glow). */}
        <div className="hidden min-h-0 select-none lg:block" aria-hidden />
      </div>
    </section>
  );
}
