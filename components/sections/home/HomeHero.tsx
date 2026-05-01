import Link from "next/link";

import { H1 } from "@/components/ui/Headings";

/** Verbatim from desktop frame `428:16741` (includes U+2028 line break). */
const HERO_TITLE = "The OpenClaw cofounder that makes your \u2028company autonomous";

/** Verbatim from desktop frame `428:16742`. */
const HERO_SUB =
  "Pancake gets you a cofounder that knows your company better than you and handles 50% of the job.";

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
      <div
        className="relative mx-auto grid w-full max-w-[1136px] grid-cols-1 px-[var(--spacing-md)] pb-[var(--spacing-xxl)] pt-[var(--spacing-xl)] lg:grid-cols-[minmax(0,752px)_minmax(0,1fr)] lg:pb-[calc(4*var(--spacing-xxl))] lg:pt-[calc(2*var(--spacing-xxl))]"
        style={{ gap: "var(--spacing-xxl)" }}
      >
        <div className="relative z-[1] flex max-w-[752px] flex-col lg:max-w-none" style={{ gap: "var(--spacing-xxl)" }}>
          <H1 className="whitespace-pre-line">{HERO_TITLE}</H1>
          <p
            className="m-0 max-w-full lg:max-w-[752px]"
            style={{
              color: "var(--subtle-text)",
              fontSize: "var(--font-size-body-large)",
              lineHeight: 1.35,
            }}
          >
            {HERO_SUB}
          </p>
          <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            <Link href="/signup" className="button inline-flex w-fit items-center justify-center no-underline" prefetch={false}>
              Try for free
            </Link>
            <p className="m-0" style={{ color: "var(--subtle-text)", fontSize: "var(--font-size-body-regular)" }}>
              No credit card needed
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none relative -mx-[var(--spacing-md)] mt-[var(--spacing-xl)] min-h-[min(60vw,280px)] select-none sm:min-h-[min(50vw,320px)] lg:mx-0 lg:mt-0 lg:min-h-[min(36rem,55vh)]"
          aria-hidden
        >
          <div
            className="absolute inset-0 left-1/2 top-1/2 h-[min(140%,520px)] w-[min(140%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.35]"
            style={{
              background: "radial-gradient(circle at 38% 36%, var(--weak-branded-surface), transparent 62%)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[min(120%,420px)] w-[min(120%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22]"
            style={{
              background: "radial-gradient(circle at 55% 44%, var(--alt-weak-branded-surface-01), transparent 68%)",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG decoration */}
          <img
            src="/orbits/orbit-2.svg"
            alt=""
            className="absolute left-[58%] top-[18%] w-[min(42%,18rem)] -translate-x-1/2 -translate-y-1/2"
            width={400}
            height={400}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pancake-svgs/top-2.svg"
            alt=""
            className="absolute left-[72%] top-[28%] w-[min(28%,12rem)] -translate-x-1/2 -translate-y-1/2"
            width={240}
            height={240}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pancake-svgs/flat-3.svg"
            alt=""
            className="absolute left-[48%] top-[62%] w-[min(22%,10rem)] -translate-x-1/2 -translate-y-1/2"
            width={200}
            height={200}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pancake-svgs/angled-1.svg"
            alt=""
            className="absolute left-[82%] top-[58%] w-[min(18%,8rem)] -translate-x-1/2 -translate-y-1/2"
            width={180}
            height={180}
          />
        </div>
      </div>
    </section>
  );
}
