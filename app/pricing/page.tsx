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

import { PricingFaq } from "@/components/sections/pricing/PricingFaq";
import { PricingHero } from "@/components/sections/pricing/PricingHero";
import { TokensBuyCards } from "@/components/sections/pricing/TokensBuyCards";
import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";
import { H3 } from "@/components/ui/Headings";
import { pricing } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Pricing — Pancake",
  description: pricing.subtitle,
};

// FAQPage JSON-LD — pricing page only. Helps search engines surface our FAQ
// answers and signals to AI crawlers what common questions we answer.
const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Pancake?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pancake is an AI co-founder platform that deploys an org of AI agents to run your company. Agents handle growth, engineering, and operations roles 24/7 — in Slack, on your schedule, with human approval for anything consequential.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Pancake for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pancake is built for solo founders and small founding teams who want to scale without hiring. Whether you're pre-revenue or already at $50K+ MRR, Pancake gives you the output of a 10-person team with the headcount of one or two.",
      },
    },
    {
      "@type": "Question",
      name: "How is Pancake different from ChatGPT or Claude?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ChatGPT and Claude are reactive — they wait to be prompted. Pancake is proactive infrastructure: agents run scheduled tasks, monitor your business, execute outreach, and ship work while you sleep. They have memory of your company, context from your docs, and a clear scope of what they can and cannot do.",
      },
    },
    {
      "@type": "Question",
      name: "Is Pancake only for technical founders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Pancake is built for founders of all technical backgrounds. Every agent, role, and workflow is configured in plain Markdown files — no code required. Engineering agents do require technical oversight, but growth and operations agents are fully accessible to non-technical founders.",
      },
    },
    {
      "@type": "Question",
      name: "Does Pancake work for solo founders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — 50% of Pancake customers are solo founders. Pancake was built to give one person the operational capacity of a small team. Solo or multiplayer, the product works the same way.",
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      {/* FAQPage JSON-LD — pricing page only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <HomeNav />

      <section className="pricing-section" aria-label="Pricing">
        <div className="pricing-section__inner">
          <PricingHero pricing={pricing} />
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

      <TokensBuyCards pricing={pricing} />

      <div className="pricing-faq__container">
        <PricingFaq pricing={pricing} />
      </div>

      <Footer />
    </main>
  );
}
