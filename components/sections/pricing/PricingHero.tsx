"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type { pricing as pricingCopy } from "@/lib/copy";

import { PancakeStack } from "./PancakeStack";

type Pricing = typeof pricingCopy;

/* Pancake top-shell colours in the same TOP→BOTTOM order they're added to
   the stack as the user moves up tiers (matches STACKS in PancakeStack).
   Used to colour the tier indicator under the plan name — filled dots
   visually echo the pancakes currently in the stack. */
const TIER_DOT_COLORS = [
  "#FFBD7A", // golden — tier 1+ (eyes-pancake, always present)
  "#BA8BFF", // purple — tier 2+
  "#68CEA7", // mint   — tier 3+
  "#FFA45F", // orange — tier 4+
  "#FF7AA0", // pink   — tier 5
];

/**
 * Pricing hero — single card with a 2-column grid inside.
 *
 * Top-left corner: plan kicker (tier name) as a soft tinted pill, brand-
 *   coloured per tier via `--plan-accent`. Lives at the card corner,
 *   absolutely positioned, so it acts as a tag for the WHOLE card rather
 *   than a label for one specific element. Floats above the grid layout.
 * Left column (`__info`): price · audience · breakdown · slider · CTA.
 * Right column (`__mascot`): pancake stack + tier-progression dots.
 *
 * Slider stop labels are absolutely positioned at exact tick percentages
 * (0%, 25%, 50%, 75%, 100%) so they line up with the slider thumb track
 * positions rather than drifting based on flex-cell math.
 */
export function PricingHero({ pricing }: { pricing: Pricing }) {
  const tiers = pricing.tiers;
  const [tierIndex, setTierIndex] = useState<number>(pricing.defaultTierIndex);
  const tier = tiers[tierIndex];
  const sliderId = useId();

  const tokenPortion = tier.totalDollars - pricing.infrastructureDollars;

  return (
    <div
      className="pricing-hero"
      style={{ "--plan-accent": tier.accent } as React.CSSProperties}
    >
      <p className="pricing-hero__plan-kicker" aria-live="polite">
        {tier.planName}
      </p>

      <div className="pricing-hero__info">
        <div className="pricing-hero__readout">
          <p className="pricing-hero__total" aria-live="polite">
            <span className="pricing-hero__total-symbol">{pricing.currencySymbol}</span>
            {tier.totalDollars}
            <span className="pricing-hero__total-suffix">{pricing.perMonth}</span>
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
          <p className="pricing-hero__audience" aria-live="polite">
            {tier.forAudience}
          </p>
        </div>

        <div className="pricing-hero__slider-wrap">
          <label htmlFor={sliderId} className="sr-only">
            plan size
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
                style={{ left: `${(i / (tiers.length - 1)) * 100}%` }}
              >
                {pricing.currencySymbol}
                {t.totalDollars - pricing.infrastructureDollars}
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

      <div className="pricing-hero__mascot">
        <div className="pricing-hero__mascot-stack" aria-hidden>
          <PancakeStack count={tier.pancakes as 1 | 2 | 3 | 4 | 5} />
        </div>
        <div className="pricing-hero__tier-dots" aria-hidden>
          {TIER_DOT_COLORS.map((color, i) => {
            const active = i < tier.pancakes;
            return (
              <span
                key={color}
                className="pricing-hero__tier-dot"
                data-active={active ? "true" : undefined}
                style={active ? { backgroundColor: color } : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
