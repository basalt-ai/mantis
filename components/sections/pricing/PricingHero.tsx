"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type { pricing as pricingCopy } from "@/lib/copy";

import { PancakeStack } from "./PancakeStack";

type Pricing = typeof pricingCopy;

function formatTokens(n: number) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return Number.isInteger(m) ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `${n / 1_000}K`;
  return String(n);
}

export function PricingHero({ pricing }: { pricing: Pricing }) {
  const tiers = pricing.tiers;
  const [tierIndex, setTierIndex] = useState<number>(pricing.defaultTierIndex);
  const tier = tiers[tierIndex];
  const sliderId = useId();

  const tokenPortion = tier.totalDollars - pricing.infrastructureDollars;

  return (
    <div className="pricing-hero">
      <div className="pricing-hero__stack-wrap" aria-hidden>
        <PancakeStack count={tier.pancakes as 1 | 2 | 3 | 4} />
      </div>

      <div className="pricing-hero__readout">
        <p className="pricing-hero__total" aria-live="polite">
          {pricing.currencySymbol}
          {tier.totalDollars}
          <span className="pricing-hero__total-suffix">{pricing.perMonth}</span>
        </p>
        <p className="pricing-hero__breakdown">
          {pricing.currencySymbol}
          {pricing.infrastructureDollars} {pricing.breakdownPrefix}
          {" + "}
          {pricing.currencySymbol}
          {tokenPortion} {pricing.breakdownTokens}
          {" · "}
          {formatTokens(tier.tokens)} {pricing.sliderTokensLabel}
        </p>
      </div>

      <div className="pricing-hero__slider-wrap">
        <label htmlFor={sliderId} className="sr-only">
          monthly token volume
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={tiers.length - 1}
          step={1}
          value={tierIndex}
          onChange={(e) => setTierIndex(Number(e.target.value))}
          aria-valuetext={`${formatTokens(tier.tokens)} tokens, ${pricing.currencySymbol}${tier.totalDollars} per month`}
          className="pricing-hero__slider"
          style={
            { "--progress": tierIndex / (tiers.length - 1) } as React.CSSProperties
          }
        />
        <div className="pricing-hero__slider-stops" aria-hidden>
          {pricing.sliderStopLabels.map((label, i) => (
            <button
              key={label}
              type="button"
              className="pricing-hero__slider-stop"
              data-active={i === tierIndex ? "true" : undefined}
              onClick={() => setTierIndex(i)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="pricing-hero__cta">
        <Link
          href={pricing.trialHref}
          className="button"
          data-size="lg"
          prefetch={false}
        >
          {pricing.trialCta}
        </Link>
        <p className="pricing-hero__cta-caption">{pricing.trialCaption}</p>
      </div>
    </div>
  );
}
