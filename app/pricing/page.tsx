/**
 * Pricing page — copy lifted from `lib/copy.ts` (`pricing.*`). Layout mirrors
 * Viktor's pricing structure minus the Enterprise plan: free-credits banner,
 * centered headline + subhead, then a single plan card with a credit-tier
 * dropdown that scales the displayed price.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { HomeNav } from "@/components/sections/home/HomeNav";
import { PricingCard } from "@/components/sections/pricing/PricingCard";
import { Footer } from "@/components/shared/Footer";
import { H2 } from "@/components/ui/Headings";
import { pricing } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Pricing — Pancake",
  description: pricing.subtitle,
};

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HomeNav />
      <section className="pricing-section flex-1" aria-labelledby="pricing-heading">
        <div className="pricing-section__inner">
          <div className="pricing-banner">
            <div className="pricing-banner__text">
              <p className="pricing-banner__primary">{pricing.banner.primary}</p>
              <p className="pricing-banner__secondary">{pricing.banner.secondary}</p>
            </div>
            <Link
              href={pricing.banner.href}
              className="button"
              data-size="md"
              prefetch={false}
            >
              {pricing.banner.cta}
            </Link>
          </div>

          <header className="pricing-section__header">
            <H2 id="pricing-heading" className="heading pricing-section__title text-center">
              {pricing.titleLine1}
              <br />
              {pricing.titleLine2}
            </H2>
            <p className="pricing-section__lede text-center">{pricing.subtitle}</p>
          </header>

          <PricingCard pricing={pricing} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
