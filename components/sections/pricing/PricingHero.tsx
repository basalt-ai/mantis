"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type { pricing as pricingCopy } from "@/lib/copy";

import { PancakeStack } from "./PancakeStack";

type Pricing = typeof pricingCopy;

/**
 * Pricing hero — single card with a 2-column grid inside.
 *
 * The price reads as a math equation rather than one big total:
 *
 *   $49 / month                  ← THE PROMISE (fixed, big, anchored)
 *   always-on cloud · everything below included
 *
 *   + Pick your token pack       ← THE CHOICE (variable, slider)
 *   [────●─── slider ───]
 *   $50  $100  $250  $500  $1000
 *
 *   = $X / month total · For X audience   ← THE RESULT (small)
 *
 * Why: the previous layout led with "$99/month" as the big number
 * and showed "$49 + $50" as a tiny breakdown line. That framing made
 * users anchor on the total. Inverting the hierarchy — $49 huge,
 * tokens as a separate user-chosen step, total as a calculation
 * footer — communicates the real promise: "Pancake is $49. Then you
 * pick the tokens you need."
 *
 * Top-left corner: plan kicker (tier name) as a soft tinted pill,
 *   brand-coloured per tier via `--plan-accent`.
 * Right column: pancake stack only.
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
        {/* THE PROMISE — fixed, big, anchored. The $49 is the brand
            commitment; it never changes regardless of slider position. */}
        <div className="pricing-hero__base">
          <p className="pricing-hero__base-price">
            <span className="pricing-hero__base-symbol">
              {pricing.currencySymbol}
            </span>
            {pricing.infrastructureDollars}
            <span className="pricing-hero__base-suffix">{pricing.perMonth}</span>
          </p>
          <p className="pricing-hero__base-caption">
            {pricing.basePriceCaption}
          </p>
        </div>

        {/* THE CHOICE — variable, user-driven. The slider is framed as
            "pick your pack" rather than "size your plan", so tokens
            feel like a deliberate add-on, not an upgrade tier. The
            leading "+" makes the math metaphor explicit. */}
        <div className="pricing-hero__choice">
          <p className="pricing-hero__choice-label">
            <span className="pricing-hero__choice-plus" aria-hidden>
              +
            </span>
            {pricing.tokenPickLabel}
          </p>
          <div className="pricing-hero__slider-wrap">
            <label htmlFor={sliderId} className="sr-only">
              token pack size
            </label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={tiers.length - 1}
              step={1}
              value={tierIndex}
              onChange={(e) => setTierIndex(Number(e.target.value))}
              aria-valuetext={`${pricing.currencySymbol}${tokenPortion} token pack, ${pricing.currencySymbol}${tier.totalDollars} per month total`}
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
        </div>

        {/* THE RESULT — small, deliberately understated. The total is
            just a calculation outcome here, not the headline. Pairs
            with the audience label so the user can sanity-check both
            number and persona-fit in one glance. */}
        <p className="pricing-hero__result" aria-live="polite">
          <span className="pricing-hero__result-equals" aria-hidden>
            =
          </span>
          <span className="pricing-hero__result-amount">
            {pricing.currencySymbol}
            {tier.totalDollars}
            {pricing.totalLabel}
          </span>
          <span className="pricing-hero__result-sep" aria-hidden>
            ·
          </span>
          <span className="pricing-hero__result-audience">
            {tier.forAudience}
          </span>
        </p>

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
      </div>
    </div>
  );
}
