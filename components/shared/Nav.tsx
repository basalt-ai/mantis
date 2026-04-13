import Link from "next/link";
import { hero } from "@/lib/copy";
import { PancakeLogo } from "./PancakeLogo";

type NavProps = {
  ctaHref?: string;
};

export function Nav({ ctaHref = "/signup" }: NavProps) {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 !shadow-none backdrop-blur-md"
      style={{
        borderBottom: "3px solid var(--border-color)",
        background: "#fffef8",
      }}
    >
      <nav className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center text-[var(--text)]"
          aria-label="Basalt home"
        >
          <PancakeLogo
            className="h-10"
            aria-hidden
          />
        </Link>
        <Link
          href={ctaHref}
          style={{ backgroundColor: hero.autonomousAccent }}
          className="max-w-[min(72vw,16rem)] rounded-theme brut-border px-2 py-2 text-center text-[0.62rem] font-semibold leading-[1.15] text-black transition sm:max-w-xs sm:px-3 sm:text-[0.7rem] md:max-w-[20rem] md:text-xs lg:text-sm"
        >
          {hero.cta}
        </Link>
      </nav>
    </header>
  );
}
