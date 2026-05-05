/**
 * Home — “Naturally works as you'd expect” section (Figma `428:15087`).
 *
 * Three feature cards, each with a 96×96 layered pancake icon (a "side"
 * SVG + a smaller "top" SVG stacked on top, with a content overlay):
 *  - .md       — pink pancake, JetBrains-Mono ".md" label
 *  - context   — purple pancake, branching-network glyph (Figma `Group 47`)
 *  - 24/7      — peach pancake, JetBrains-Mono "24/7" label
 *
 * All pancake side/top paths and the network glyph are exact Figma SVG
 * exports living in `public/features/`.
 */

type FeatureCard = {
  id: string;
  pancakeSide: string;
  pancakeTop: string;
  /** Content overlaid on the pancake — either a short text label or an icon SVG. */
  overlay:
    | { kind: "label"; text: string }
    | { kind: "icon"; src: string; w: number; h: number; left: number; top: number };
  title: string;
  body: string;
};

const FEATURES: FeatureCard[] = [
  {
    id: "md",
    pancakeSide: "/features/feature-md-side.svg",
    pancakeTop: "/features/feature-md-top.svg",
    overlay: { kind: "label", text: ".md" },
    title: "Markdown-configured",
    body: "Every agent, role, and workflow defined in .md files you control",
  },
  {
    id: "ctx",
    pancakeSide: "/features/feature-ctx-side.svg",
    pancakeTop: "/features/feature-ctx-top.svg",
    overlay: {
      kind: "icon",
      src: "/features/feature-network.svg",
      w: 37.665,
      h: 42.172,
      left: 29.38,
      top: 23,
    },
    title: "Context-aware",
    body:
      "Agents pull context from your Notion, docs, and meeting notes. They know your business.",
  },
  {
    id: "247",
    pancakeSide: "/features/feature-247-side.svg",
    pancakeTop: "/features/feature-247-top.svg",
    overlay: { kind: "label", text: "24/7" },
    title: "Always on",
    body: "Your agent org runs 24/7 — no downtime, no sick days",
  },
];

export function HomeLandingFeatures() {
  return (
    <div className="home-landing-features" data-node-id="428:15091">
      {FEATURES.map((card) => (
        <article key={card.id} className="home-landing-feature-card">
          <div
            className="home-landing-feature-card__pancake"
            data-feature={card.id}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Figma SVG export */}
            <img
              className="home-landing-feature-card__pancake-side"
              src={card.pancakeSide}
              alt=""
              width={96}
              height={96}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- Figma SVG export */}
            <img
              className="home-landing-feature-card__pancake-top"
              src={card.pancakeTop}
              alt=""
              width={92}
              height={88}
            />
            {card.overlay.kind === "label" ? (
              <span className="home-landing-feature-card__pancake-label">
                {card.overlay.text}
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- Figma SVG export
              <img
                className="home-landing-feature-card__pancake-icon"
                src={card.overlay.src}
                alt=""
                width={card.overlay.w}
                height={card.overlay.h}
                style={{ left: `${card.overlay.left}px`, top: `${card.overlay.top}px` }}
              />
            )}
          </div>
          <div className="home-landing-feature-card__copy">
            <h3 className="home-landing-feature-card__title">{card.title}</h3>
            <p className="home-landing-feature-card__body">{card.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
