import type { Metadata } from "next";
import Link from "next/link";

import { Nav } from "@/components/shared/Nav";
import { hero, pricing } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Pricing — Pancake",
  description: pricing.subtitle,
};

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="px-4 pb-24 pt-[calc(4.5rem+3rem)] sm:px-6 sm:pt-[calc(4.5rem+4rem)]">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
            {pricing.title}
          </h1>
          <p className="mt-3 text-lg text-[var(--text-muted)]">{pricing.subtitle}</p>

          <div className="mx-auto mt-12 max-w-md rounded-theme brut-border bg-[#fffef8] px-8 py-12 sm:px-10 sm:py-14">
            <p className="font-display text-3xl font-bold text-black sm:text-4xl">
              {pricing.priceLine}
            </p>
            <p className="mt-6 text-base text-[var(--text-muted)] sm:text-lg">
              {pricing.cardLine}
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/signup"
                style={{ backgroundColor: hero.autonomousAccent }}
                className="inline-flex rounded-theme brut-border px-10 py-4 text-base font-semibold !text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                {pricing.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
