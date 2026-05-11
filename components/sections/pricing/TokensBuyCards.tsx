/**
 * "What your tokens buy" — asymmetric cards (2 top, 1 wide bottom) with
 * a simplified Slack-style exchange in each. The chat block reuses the same
 * typography/avatar grammar as `components/shared/SlackUI.tsx` so the visual
 * language stays consistent across the site, but stripped down: no sidebar,
 * no composer, no thread replies — just two stacked messages (user → pancake).
 */
import type { pricing as pricingCopy } from "@/lib/copy";

type Pricing = typeof pricingCopy;
type Card = Pricing["buys"]["cards"][number];

export function TokensBuyCards({ pricing }: { pricing: Pricing }) {
  return (
    <section className="pricing-buys" aria-labelledby="pricing-buys-title">
      <div className="pricing-buys__inner">
        <h2 id="pricing-buys-title" className="heading pricing-buys__title">
          {pricing.buys.title}
        </h2>
        <div className="pricing-buys__grid">
          {pricing.buys.cards.map((card) => (
            <BuyCard key={card.kicker} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BuyCard({ card }: { card: Card }) {
  return (
    <article
      className="pricing-buys__card"
      data-wide={card.wide ? "true" : undefined}
    >
      <header className="pricing-buys__card-header">
        <p className="pricing-buys__card-kicker">{card.kicker}</p>
        <p className="pricing-buys__card-headline">{card.tokenRange}</p>
        <p className="pricing-buys__card-tag">{card.tag}</p>
      </header>
      <div className="pricing-buys__chat">
        <UserMessage user={card.user} />
        <AgentMessage agent={card.agent} />
      </div>
    </article>
  );
}

function UserMessage({ user }: { user: Card["user"] }) {
  return (
    <div className="flex items-start gap-3">
      <UserInitialAvatar
        initial={user.initial}
        accent={user.accent}
        accentInk={user.accentInk}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-bold text-[#1d1c1d]">{user.name}</span>
          <span className="text-[12px] font-normal text-[#616061]">{user.time}</span>
        </div>
        <p className="mt-1 whitespace-pre-line text-[15px] font-normal leading-[1.46668] text-[#1d1c1d]">
          {user.text}
        </p>
      </div>
    </div>
  );
}

function AgentMessage({ agent }: { agent: Card["agent"] }) {
  const artifact = "artifact" in agent ? agent.artifact : undefined;
  return (
    <div className="flex items-start gap-3">
      <PancakeAgentAvatar />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-bold text-[#1d1c1d]">pancake</span>
          <span className="rounded-[3px] bg-[#e8e8e8] px-1 py-px text-[10px] font-bold uppercase tracking-wide text-[#616061]">
            APP
          </span>
          <span className="text-[12px] font-normal text-[#616061]">{agent.time}</span>
        </div>
        <p className="mt-1 whitespace-pre-line text-[15px] font-normal leading-[1.46668] text-[#1d1c1d]">
          {agent.text}
        </p>
        {artifact === "pdf-q3" ? <PdfQ3Artifact /> : null}
      </div>
    </div>
  );
}

/**
 * Faked PDF page thumbnail attached to the Full Projects agent reply.
 * Placeholder shapes only — no real numbers — so the eye sees that work
 * shipped without the page reading as a marketing claim.
 */
function PdfQ3Artifact() {
  return (
    <figure className="pricing-buys__pdf" aria-label="q3-review.pdf preview">
      <header className="pricing-buys__pdf-header">
        <p className="pricing-buys__pdf-title">Q3 Review</p>
        <p className="pricing-buys__pdf-meta">Internal · Lisa</p>
      </header>
      <div className="pricing-buys__pdf-tiles">
        <PdfMetricTile label="MRR" shape="ascending" />
        <PdfMetricTile label="Churn" shape="descending" />
        <PdfMetricTile label="NPS" shape="flat" />
      </div>
      <div className="pricing-buys__pdf-lines" aria-hidden>
        <span className="pricing-buys__pdf-line" style={{ width: "92%" }} />
        <span className="pricing-buys__pdf-line" style={{ width: "84%" }} />
        <span className="pricing-buys__pdf-line" style={{ width: "76%" }} />
        <span className="pricing-buys__pdf-line" style={{ width: "60%" }} />
      </div>
      <footer className="pricing-buys__pdf-footer">1 of 5</footer>
    </figure>
  );
}

function PdfMetricTile({
  label,
  shape,
}: {
  label: string;
  shape: "ascending" | "descending" | "flat";
}) {
  const heights =
    shape === "ascending"
      ? [4, 7, 10, 13]
      : shape === "descending"
        ? [13, 10, 7, 4]
        : [8, 9, 8, 9];
  return (
    <div className="pricing-buys__pdf-tile">
      <span className="pricing-buys__pdf-tile-label">{label}</span>
      <div className="pricing-buys__pdf-tile-bars" aria-hidden>
        {heights.map((h, i) => (
          <span
            key={i}
            className="pricing-buys__pdf-tile-bar"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function UserInitialAvatar({
  initial,
  accent,
  accentInk,
}: {
  initial: string;
  accent: string;
  accentInk: string;
}) {
  return (
    <div
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[6px] shadow-[inset_0_-1px_0_rgba(0,0,0,0.10),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
      aria-hidden
      style={{ backgroundColor: accent }}
    >
      <span
        className="text-[15px] font-bold leading-none"
        style={{ color: accentInk }}
      >
        {initial}
      </span>
    </div>
  );
}

function PancakeAgentAvatar() {
  // Same disc + cream backing as SlackUI's CeoAgentAvatar so the agent reads
  // identically across the site. Square-radius 6px to match Slack app icons.
  return (
    <div
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#FFF1DA] shadow-[inset_0_-1px_0_rgba(0,0,0,0.10),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- pancake mascot raster */}
      <img
        src="/pancake-monster.png"
        alt=""
        width={32}
        height={32}
        className="block h-8 w-8 object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
