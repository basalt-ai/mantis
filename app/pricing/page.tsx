/**
 * Pricing page — copy lifted from `lib/copy.ts` (`pricing.*`). Centered eyebrow +
 * headline + subhead, then a single plan card with a horizontal credit-tier
 * chip selector that scales the displayed price.
 */
import type { Metadata } from "next";

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
          <header className="pricing-section__header">
            <p className="pricing-eyebrow">{pricing.eyebrow}</p>
            <H2 id="pricing-heading" className="heading pricing-section__title text-center">
              {pricing.title}
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
