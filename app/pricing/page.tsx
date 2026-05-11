/**
 * Pricing — radically honest. One plan, one slider, one total. The pancake-
 * monster widget grows its stack as the user drags the slider; everything else
 * on the page is support. Pricing numbers live in `lib/copy.ts → pricing.*`.
 */
import type { Metadata } from "next";

import { PricingFaq } from "@/components/sections/pricing/PricingFaq";
import { PricingHero } from "@/components/sections/pricing/PricingHero";
import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";
import { H2, H3 } from "@/components/ui/Headings";
import { pricing } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Pricing — Pancake",
  description: pricing.subtitle,
};

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HomeNav />

      <section className="pricing-section" aria-labelledby="pricing-heading">
        <div className="pricing-section__inner">
          <header className="pricing-section__header">
            <H2 id="pricing-heading" className="heading pricing-section__title text-center">
              {pricing.title}
            </H2>
            <p className="pricing-section__lede text-center">{pricing.subtitle}</p>
          </header>

          <PricingHero pricing={pricing} />
        </div>
      </section>

      <section className="pricing-buys" aria-labelledby="pricing-buys-title">
        <div className="pricing-buys__inner">
          <h2 id="pricing-buys-title" className="heading pricing-buys__title">
            {pricing.buys.title}
          </h2>
          <ul className="pricing-buys__grid">
            {pricing.buys.cards.map((card) => (
              <li key={card.name} className="pricing-buys__card">
                <H3 className="heading pricing-buys__card-name">{card.name}</H3>
                <p className="pricing-buys__card-budget">{card.budget}</p>
                <ul className="pricing-buys__card-examples">
                  {card.examples.map((ex) => (
                    <li key={ex} className="pricing-buys__card-example">
                      {ex}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

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

      <div className="pricing-faq__container">
        <PricingFaq pricing={pricing} />
      </div>

      <Footer />
    </main>
  );
}
