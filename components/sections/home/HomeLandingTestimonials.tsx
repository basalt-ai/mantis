/**
 * Home — "Take it from them" section (Figma `428:15175`).
 *
 * Infinite, slow horizontal carousel of testimonial cards. The track holds
 * each testimonial twice; a manual `gsap.ticker` tick translates it left at a
 * constant px/s. When `offset` crosses one full stride (width of the
 * un-duplicated set including gaps), it wraps back by `+stride` — visually
 * seamless because the duplicated cards sit exactly where the originals were.
 *
 * The outer band breaks out of the page container (`width: 100vw`) so cards
 * exit/enter beyond the viewport edges; the soft mask gradient feathers the
 * sides.
 *
 * Card layout is a 1:1 port of Figma node `428:15180` (avatar + identity + X
 * mark, body quote, hairline divider, stats row with right-anchored "via X").
 */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { gsap } from "gsap";

const CARD_GAP_PX = 16;
const CAROUSEL_SPEED_PX_PER_S = 36;

type Testimonial = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  quote: ReactNode;
};

/**
 * Highlights `@pancake` mentions in the deep brand purple from Figma.
 * Kept as a tiny helper so testimonial text stays plain strings in source.
 */
function withPancakeMention(text: string): ReactNode {
  const parts = text.split(/(@pancake)/g);
  return parts.map((part, i) =>
    part === "@pancake" ? (
      <span key={i} className="home-landing-testimonial__mention">
        {part}
      </span>
    ) : (
      part
    )
  );
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Maya Patel",
    handle: "@mayapatel · 1d",
    avatar: "/testimonials/avatar-1.png",
    quote:
      "Day 14 of the pancake experiment: my engineering agent has shipped 38 PRs, my recruiter agent screened 412 candidates, and my CFO agent is actually scary good at modeling.",
  },
  {
    id: "t2",
    name: "Hana Sato",
    handle: "@hanasato · 1d",
    avatar: "/testimonials/avatar-2.png",
    quote: withPancakeMention(
      'I asked @pancake to "run my entire content engine" and it just… did. Calendar, briefs, drafts, scheduling, analytics. I am the bottleneck now.'
    ),
  },
  {
    id: "t3",
    name: "Leo Moretti",
    handle: "@leomoretti · 1d",
    avatar: "/testimonials/avatar-3.png",
    quote:
      "Hired 4 pancake agents on Friday. Came back Monday to a launched landing page, 11 closed deals, and an inbox at zero. I genuinely don’t know what to do with my time.",
  },
  {
    id: "t4",
    name: "Daniel Kim",
    handle: "@danielkim · 1d",
    avatar: "/testimonials/avatar-4.png",
    quote:
      "The kill switch works. I tested it. My whole org froze mid-sentence, then resumed exactly where it left off when I un-paused. This is actually production software.",
  },
];

function XMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="home-landing-testimonial__brand-icon"
      aria-hidden
      focusable="false"
    >
      <path
        d="M29.4793 14.8455H32.5832L25.804 22.6739L33.7798 33.3283H27.5314L22.6416 26.8675L17.041 33.3283H13.9371L21.1886 24.9547L13.5367 14.8455H19.9425L24.3645 20.752L29.4793 14.8455ZM28.3906 31.4519H30.109L19.0068 16.6266H17.1625L28.3906 31.4519Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <article className="home-landing-testimonial" aria-label={`Testimonial from ${t.name}`}>
      <div className="home-landing-testimonial__header">
        <div className="home-landing-testimonial__avatar">
          {/* eslint-disable-next-line @next/next/no-img-element -- static avatar PNG */}
          <img src={t.avatar} alt="" width={48} height={48} />
        </div>
        <div className="home-landing-testimonial__identity">
          <p className="home-landing-testimonial__name">{t.name}</p>
          <p className="home-landing-testimonial__handle">{t.handle}</p>
        </div>
        <div className="home-landing-testimonial__brand">
          <XMark />
        </div>
      </div>
      <p className="home-landing-testimonial__quote">{t.quote}</p>
      <hr className="home-landing-testimonial__divider" />
      <div className="home-landing-testimonial__meta">
        <span className="home-landing-testimonial__stat">
          <strong>321</strong> replies
        </span>
        <span className="home-landing-testimonial__stat">
          <strong>821</strong> reposts
        </span>
        <span className="home-landing-testimonial__stat">
          <strong>2.8k</strong> likes
        </span>
        <span className="home-landing-testimonial__via">via X</span>
      </div>
    </article>
  );
}

export function HomeLandingTestimonials() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Track viewport — switch to a snap-scroll mobile carousel below `lg`.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 1023.98px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Desktop only — the infinite GSAP ticker scroll.
  useEffect(() => {
    if (isMobile) return;
    const track = trackRef.current;
    if (!track) return;
    if (reducedMotion) {
      track.style.transform = "translate3d(0,0,0)";
      return;
    }

    let offset = 0;
    let stride = 0;

    const measure = () => {
      const total = track.scrollWidth;
      stride = total / 2 + CARD_GAP_PX / 2;
    };

    measure();

    const tick = (_time: number, deltaTime: number) => {
      if (stride <= 0) return;
      offset -= (deltaTime / 1000) * CAROUSEL_SPEED_PX_PER_S;
      while (offset <= -stride) offset += stride;
      track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    };

    const handleResize = () => {
      measure();
    };

    gsap.ticker.add(tick);
    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", handleResize);
    };
  }, [reducedMotion, isMobile]);

  // Mobile — track which card is centered for the dots indicator.
  useEffect(() => {
    if (!isMobile) return;
    const track = mobileTrackRef.current;
    if (!track) return;
    const update = () => {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      const cards = track.querySelectorAll<HTMLElement>(".home-landing-testimonial");
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIndex(best);
    };
    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => track.removeEventListener("scroll", update);
  }, [isMobile]);

  function scrollToTestimonial(i: number) {
    const track = mobileTrackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(".home-landing-testimonial");
    const target = cards[i];
    if (!target) return;
    const offset = target.offsetLeft - (track.clientWidth - target.clientWidth) / 2;
    track.scrollTo({ left: offset, behavior: "smooth" });
  }

  // Desktop loop renders cards twice for seamless looping.
  const looped = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="home-landing-testimonials" aria-roledescription="carousel">
      {/* Desktop track — infinite GSAP scroll. */}
      <div
        ref={trackRef}
        className="home-landing-testimonials__track home-landing-testimonials__track--desktop"
      >
        {looped.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} />
        ))}
      </div>

      {/* Mobile track — native snap scroll + dot indicator. */}
      <div className="home-landing-testimonials__mobile">
        <div
          ref={mobileTrackRef}
          className="home-landing-testimonials__track home-landing-testimonials__track--mobile"
        >
          {TESTIMONIALS.map((t) => (
            <Card key={`${t.id}-mobile`} t={t} />
          ))}
        </div>
        <div
          className="home-landing-testimonials__dots"
          role="tablist"
          aria-label="Customer stories"
        >
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Story by ${t.name}`}
              className={`home-landing-testimonials__dot ${i === activeIndex ? "home-landing-testimonials__dot--active" : ""}`}
              onClick={() => scrollToTestimonial(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
