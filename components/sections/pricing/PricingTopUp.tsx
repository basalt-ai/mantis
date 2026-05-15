/**
 * Top-up callout — sits in its own card BELOW the subscription hero,
 * deliberately separate so users read it as "this is not part of the
 * recurring bundle". Same surface treatment as the hero so it looks
 * like a sibling, but smaller and without the slider/mascot machinery.
 *
 * Three pieces of info surfaced explicitly:
 *   1. "Tokens never expire. Stack across months." — emotional headline,
 *      sits in the visual position of the hero's price.
 *   2. Body line — explains WHEN to top up (run out mid-month or want a
 *      buffer) and that any amount/any time is OK.
 *   3. Two terms pills — "Min $10" + "+10% markup" — the contract terms
 *      stated upfront so the user isn't surprised at checkout.
 */
import type { pricing as pricingCopy } from "@/lib/copy";

type Pricing = typeof pricingCopy;

export function PricingTopUp({ pricing }: { pricing: Pricing }) {
  return (
    <aside
      className="pricing-topup"
      aria-labelledby="pricing-topup-title"
    >
      <p className="pricing-topup__kicker">{pricing.topUp.kicker}</p>
      <h2 id="pricing-topup-title" className="pricing-topup__title">
        {pricing.topUp.title}
      </h2>
      <p className="pricing-topup__body">{pricing.topUp.body}</p>
      <ul className="pricing-topup__terms" aria-label="Top-up terms">
        <li className="pricing-topup__term">{pricing.topUp.minLabel}</li>
        <li className="pricing-topup__term">{pricing.topUp.markupLabel}</li>
      </ul>
    </aside>
  );
}
