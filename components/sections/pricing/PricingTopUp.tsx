/**
 * Top-up callout — sits in its own NARROW card to the RIGHT of the
 * subscription hero (vertical column, ~1/5 of the section width).
 * Deliberately split from the hero so the user reads it as "this is
 * not part of the recurring bundle". Same surface treatment as the
 * hero so it looks like a sibling.
 *
 * Vertical content rhythm — kicker / title / body at top, terms +
 * honesty note at bottom — with justify-content: space-between in CSS
 * to distribute them across the matched-height card.
 *
 * Four pieces surfaced explicitly:
 *   1. "Tokens never expire. Stack across months." — emotional headline.
 *   2. Body — when to top up, that any amount/any time works.
 *   3. Two terms pills (Min $10 + +10% markup) — contract terms.
 *   4. Markup honesty note — "That's how we make money. No other tricks."
 *      Radical-transparency line right under the markup pill so the
 *      +10% reads as a deliberate, disclosed choice rather than a tax.
 */
import type { pricing as pricingCopy } from "@/lib/copy";

type Pricing = typeof pricingCopy;

export function PricingTopUp({ pricing }: { pricing: Pricing }) {
  return (
    <aside
      className="pricing-topup"
      aria-labelledby="pricing-topup-title"
    >
      <div className="pricing-topup__top">
        <p className="pricing-topup__kicker">{pricing.topUp.kicker}</p>
        <h2 id="pricing-topup-title" className="pricing-topup__title">
          {pricing.topUp.title}
        </h2>
        <p className="pricing-topup__body">{pricing.topUp.body}</p>
      </div>
      <div className="pricing-topup__bottom">
        <ul className="pricing-topup__terms" aria-label="Top-up terms">
          <li className="pricing-topup__term">{pricing.topUp.minLabel}</li>
          <li className="pricing-topup__term">{pricing.topUp.markupLabel}</li>
        </ul>
        <p className="pricing-topup__markup-note">
          {pricing.topUp.markupNote}
        </p>
      </div>
    </aside>
  );
}
