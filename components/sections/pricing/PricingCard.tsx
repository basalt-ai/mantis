"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";

import type { pricing as pricingCopy } from "@/lib/copy";

type Pricing = typeof pricingCopy;

type Props = {
  pricing: Pricing;
};

export function PricingCard({ pricing }: Props) {
  const { plan, priceSuffix, tierGroupLabel } = pricing;
  const tiers = plan.tiers;

  const [selectedIndex, setSelectedIndex] = useState<number>(plan.defaultTierIndex);
  const groupLabelId = useId();
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = tiers[selectedIndex];

  function focusAndSelect(index: number) {
    setSelectedIndex(index);
    chipRefs.current[index]?.focus();
  }

  function onChipKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusAndSelect((i + 1) % tiers.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusAndSelect((i - 1 + tiers.length) % tiers.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAndSelect(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAndSelect(tiers.length - 1);
    }
  }

  return (
    <div className="pricing-card">
      <p className="pricing-card__name">{plan.name}</p>

      <div className="pricing-tier-group__wrapper">
        <p id={groupLabelId} className="pricing-tier-group__label">
          {tierGroupLabel}
        </p>
        <div
          role="radiogroup"
          aria-labelledby={groupLabelId}
          className="pricing-tier-group"
        >
          {tiers.map((tier, i) => {
            const isSelected = i === selectedIndex;
            const compact = `${tier.credits / 1000}k`;
            const label = `${tier.credits.toLocaleString()} credits monthly, $${tier.price} per month`;
            return (
              <button
                key={tier.credits}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={label}
                tabIndex={isSelected ? 0 : -1}
                className="pricing-tier-chip"
                onClick={() => setSelectedIndex(i)}
                onKeyDown={(event) => onChipKeyDown(event, i)}
              >
                {compact}
              </button>
            );
          })}
        </div>
      </div>

      <p className="pricing-card__price" aria-live="polite">
        ${selected.price}
        <span className="pricing-card__price-suffix">{priceSuffix}</span>
      </p>

      <ul className="pricing-card__features">
        {plan.features.map((feature) => (
          <li key={feature} className="pricing-card__feature">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={plan.href} className="button" data-size="lg" prefetch={false}>
        {plan.cta}
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="pricing-card__feature-icon"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
