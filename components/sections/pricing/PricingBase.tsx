/**
 * Base-plan card — the LEFT of the two pricing cards. Communicates
 * the fixed promise: "$49/month for the always-on cloud computer".
 * No interactivity, no slider — the price never moves regardless of
 * what the user does next door. The eye reads here first, anchors
 * on $49, then moves right to size the token pack.
 *
 * Layout: kicker pill → big price → title → body. Whole card centred
 * vertically so the price sits at the optical centre, balancing the
 * token card (right) which has slider + mascot + CTA stacked top-to-
 * bottom.
 */
import type { pricing as pricingCopy } from "@/lib/copy";

type Pricing = typeof pricingCopy;

export function PricingBase({ pricing }: { pricing: Pricing }) {
  return (
    <article
      className="pricing-base"
      aria-labelledby="pricing-base-title"
    >
      <p className="pricing-base__kicker">{pricing.basePlan.kicker}</p>

      <p className="pricing-base__price">
        <span className="pricing-base__symbol">{pricing.currencySymbol}</span>
        {pricing.infrastructureDollars}
        <span className="pricing-base__suffix">{pricing.perMonth}</span>
      </p>

      <h2 id="pricing-base-title" className="pricing-base__title">
        {pricing.basePlan.title}
      </h2>

      <p className="pricing-base__body">{pricing.basePlan.body}</p>
    </article>
  );
}
