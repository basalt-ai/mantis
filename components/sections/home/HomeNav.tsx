import Link from "next/link";
import { SiDiscord } from "react-icons/si";

import { HOME_PAGE_CONTAINER_CLASS } from "@/components/sections/home/home-layout";
import { Button } from "@/components/ui/Button";

/** Same Discord invite as `main`'s Nav. */
const DISCORD_INVITE_URL = "https://discord.gg/brJ99Up6ym";

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const navLinkClassName =
  "home-nav-primary-link inline-flex min-h-[var(--control-size-md)] items-center no-underline transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function HomeNav() {
  return (
    <header
      className="w-full py-[var(--spacing-lg)] lg:py-[calc(2*var(--spacing-xxl))]"
      style={{
        backgroundColor: "var(--surface)",
      }}
    >
      <div className={`flex items-center justify-between gap-[var(--spacing-md)] ${HOME_PAGE_CONTAINER_CLASS}`}>
        <Link
          href="/"
          className="home-nav-logo-link inline-flex shrink-0 items-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Pancake home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- vector logo; next/image SVG tradeoffs */}
          <img
            src="/pancake-logo.svg"
            alt=""
            className="block h-[var(--size-home-nav-logo-height)] w-auto"
            width={156}
            height={44}
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        <div className="home-nav-end flex items-center justify-end" style={{ gap: "calc(2 * var(--spacing-xl))" }}>
          <div className="flex lg:hidden">
            <Button type="button" iconOnly size="lg" variant="ghost" aria-label="Menu">
              <MenuIcon />
            </Button>
          </div>

          <nav className="hidden items-center lg:flex" style={{ gap: "calc(2 * var(--spacing-xl))" }} aria-label="Primary">
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${navLinkClassName} home-nav-primary-link--icon`}
              aria-label="Join our Discord"
            >
              <SiDiscord size={20} aria-hidden />
            </a>
            <Link href="/pricing" className={navLinkClassName}>
              Pricing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
