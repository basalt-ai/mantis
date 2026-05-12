"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type { pricing as pricingCopy } from "@/lib/copy";

import { PancakeStack } from "./PancakeStack";

type Pricing = typeof pricingCopy;

/**
 * Pricing hero — 2-column layout.
 *   Left:  active team label, big price, work-scale, breakdown, slider with
 *          team-size stops, CTA.
 *   Right: pancake-monster stack (1–5), grows with the slider.
 *
 * The slider stops are calibrated to TEAM SIZE rather than token volumes;
 * each tier.teamLabel surfaces both above the price (as the active kicker)
 * and under the slider (as the stop label). No raw token counts on screen.
 * On narrow viewports the columns stack with the pancake on top.
 */
export function PricingHero({ pricing }: { pricing: Pricing }) {
  const tiers = pricing.tiers;
  const [tierIndex, setTierIndex] = useState<number>(pricing.defaultTierIndex);
  const tier = tiers[tierIndex];
  const sliderId = useId();

  const tokenPortion = tier.totalDollars - pricing.infrastructureDollars;

  return (
    <div className="pricing-hero">
      <div className="pricing-hero__info">
        <div className="pricing-hero__readout">
          <p className="pricing-hero__team-label" aria-live="polite">
            {tier.planName}
          </p>
          <p className="pricing-hero__total" aria-live="polite">
            <span className="pricing-hero__total-symbol">{pricing.currencySymbol}</span>
            {tier.totalDollars}
            <span className="pricing-hero__total-suffix">{pricing.perMonth}</span>
          </p>
          <p className="pricing-hero__work-scale" aria-live="polite">
            {tier.forAudience}
          </p>
          <p className="pricing-hero__breakdown" aria-live="polite">
            <span className="pricing-hero__breakdown-part">
              <span className="pricing-hero__breakdown-amount">
                {pricing.currencySymbol}
                {pricing.infrastructureDollars}
              </span>
              <span className="pricing-hero__breakdown-label">
                {pricing.breakdownFixedLabel}
              </span>
            </span>
            <span className="pricing-hero__breakdown-plus" aria-hidden>
              +
            </span>
            <span className="pricing-hero__breakdown-part">
              <span className="pricing-hero__breakdown-amount">
                {pricing.currencySymbol}
                {tokenPortion}
              </span>
              <span className="pricing-hero__breakdown-label">
                {pricing.breakdownTokensLabel}
              </span>
            </span>
          </p>
        </div>

        <div className="pricing-hero__slider-wrap">
          <label htmlFor={sliderId} className="sr-only">
            team size
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={tiers.length - 1}
            step={1}
            value={tierIndex}
            onChange={(e) => setTierIndex(Number(e.target.value))}
            aria-valuetext={`${tier.planName}, ${pricing.currencySymbol}${tier.totalDollars} per month`}
            className="pricing-hero__slider"
            style={
              { "--progress": tierIndex / (tiers.length - 1) } as React.CSSProperties
            }
          />
          <div className="pricing-hero__slider-stops" aria-hidden>
            {tiers.map((t, i) => (
              <button
                key={t.planName}
                type="button"
                className="pricing-hero__slider-stop"
                data-active={i === tierIndex ? "true" : undefined}
                onClick={() => setTierIndex(i)}
              >
                {pricing.currencySymbol}
                {t.totalDollars}
              </button>
            ))}
          </div>
        </div>

        <div className="pricing-hero__cta">
          <Link
            href={pricing.trialHref}
            className="button inline-flex items-center justify-center no-underline"
            data-size="lg"
            prefetch={false}
          >
            {pricing.trialCta}
          </Link>
          <p className="pricing-hero__cta-caption">{pricing.trialCaption}</p>
        </div>
      </div>

      <div className="pricing-hero__stack-wrap" aria-hidden>
        <PancakeStack count={tier.pancakes as 1 | 2 | 3 | 4 | 5} />
      </div>
    </div>
  );
}
