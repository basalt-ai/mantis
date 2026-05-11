"use client";

import { useState } from "react";

import type { pricing as pricingCopy } from "@/lib/copy";

type Pricing = typeof pricingCopy;

export function PricingFaq({ pricing }: { pricing: Pricing }) {
  const { faq } = pricing;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="pricing-faq" aria-labelledby="pricing-faq-title">
      <h2 id="pricing-faq-title" className="heading pricing-faq__title">
        {faq.title}
      </h2>
      <ul className="pricing-faq__list">
        {faq.items.map((item, i) => {
          const isOpen = i === openIndex;
          return (
            <li key={item.q} className="pricing-faq__item">
              <button
                type="button"
                className="pricing-faq__question"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <Chevron open={isOpen} />
              </button>
              {isOpen ? (
                <p className="pricing-faq__answer">{item.a}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{
        transform: open ? "rotate(180deg)" : undefined,
        transition: "transform 160ms ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
