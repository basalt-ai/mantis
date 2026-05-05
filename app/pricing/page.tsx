/**
 * Pricing page — copy lifted from `lib/copy.ts` (`pricing.*`), redesigned in
 * the phase-3 home design system (Aeonik / Aeonik Fono, surface tokens,
 * 32 px squircle card, primary `.button[data-size="lg"]`). Uses the shared
 * `HomeNav` so the navbar matches the rest of the site exactly.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";
import { H2 } from "@/components/ui/Headings";
import { pricing } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Pricing — Pancake",
  description: pricing.subtitle,
};

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <HomeNav />
      <section className="pricing-section" aria-labelledby="pricing-heading">
        <div className="pricing-section__inner">
          <header className="pricing-section__header">
            <H2 id="pricing-heading" className="heading pricing-section__title text-center">
              {pricing.title}
            </H2>
            <p className="pricing-section__lede text-center">{pricing.subtitle}</p>
          </header>

          <div className="pricing-card">
            <p className="pricing-card__price">{pricing.priceLine}</p>
            <p className="pricing-card__line">{pricing.cardLine}</p>
            <Link
              href="/signup"
              className="button inline-flex w-fit shrink-0 items-center justify-center no-underline"
              data-size="lg"
              prefetch={false}
            >
              {pricing.cta}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
