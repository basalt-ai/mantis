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

        {/* HQ mascot + ellipse glow — Figma `428:14900`; inner dotted ring `428:14903` (Ellipse 10). */}
        <div className="home-hero-pancake" aria-hidden>
          <div className="home-hero-pancake-stack">
            <div className="home-hero-pancake-stack-inner">
              {/* eslint-disable-next-line @next/next/no-img-element -- Figma-export rasters */}
              <img
                className="home-hero-pancake-ellipse"
                src="/home-hero-monster-ellipse.png"
                alt=""
                width={946}
                height={946}
                decoding="async"
              />
              <div className="home-hero-pancake-dotted-ring">
                <svg
                  viewBox="0 0 415.465 405.127"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden
                >
                  <path
                    d="M414.965 184.749C414.965 298.876 325.247 404.627 210.795 404.627C154.366 404.627 92.9966 395.3 55.6259 358.819C17.1997 321.308 0.5 252.787 0.5 194.929C0.5 130.2 35.4502 87.2514 82.1681 49.3617C117.82 20.4465 161.257 0.5 210.795 0.5C325.247 0.5 414.965 70.6229 414.965 184.749Z"
                    stroke="var(--text)"
                    strokeLinecap="round"
                    strokeWidth={1}
                    strokeDasharray="0.578125 6.9375"
                  />
                </svg>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element -- Figma-export rasters */}
              <img
                className="home-hero-pancake-img"
                src="/pancake-monster.png"
                alt=""
                width={496}
                height={512}
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
