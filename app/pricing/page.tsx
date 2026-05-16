/**
 * Pricing — radically honest. Two costs: a small fixed $29 for an always-on
 * cloud machine plus tokens at retail. Margin comes from the bulk discount
 * the labs give us, not from marking up the user.
 *
 * Section order: hero → manifesto → what your tokens buy → FAQ.
 * Trust before value: the user needs to believe the price is fair before they
 * care what it gets them.
 */
import type { Metadata } from "next";

import { PricingBase } from "@/components/sections/pricing/PricingBase";
import { PricingFaq } from "@/components/sections/pricing/PricingFaq";
import { PricingHero } from "@/components/sections/pricing/PricingHero";
import { PricingIncluded } from "@/components/sections/pricing/PricingIncluded";
import { TokensBuyCards } from "@/components/sections/pricing/TokensBuyCards";
import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";
import { H3 } from "@/components/ui/Headings";
import { pricing } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Pricing — Pancake",
  description: pricing.subtitle,
};

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HomeNav />

      <section className="pricing-section" aria-label="Pricing">
        <div className="pricing-section__inner">
          <PricingBase pricing={pricing} />
          <PricingHero pricing={pricing} />
        </div>
      </section>

      <PricingIncluded pricing={pricing} />

      <section className="pricing-manifesto" aria-labelledby="pricing-manifesto-title">
        <div className="pricing-manifesto__inner">
          <h2 id="pricing-manifesto-title" className="heading pricing-manifesto__title">
            {pricing.manifesto.title}
          </h2>
          <ul className="pricing-manifesto__grid">
            {pricing.manifesto.items.map((item) => (
              <li key={item.title} className="pricing-manifesto__item">
                <H3 className="heading pricing-manifesto__item-title">{item.title}</H3>
                <p className="pricing-manifesto__item-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TokensBuyCards pricing={pricing} />

      <div className="pricing-faq__container">
        <PricingFaq pricing={pricing} />
      </div>

      <Footer />
    </main>
  );
}
