/**
 * Mobile-only "An entire org working for you" section — Figma `596:2940`.
 *
 * Mobile rebuilds the desktop org diagram for narrow viewports:
 *  - "We need a dedicated QA tester" speech bubble between the You and
 *    Pancake icons (a Slack-style hint).
 *  - Two mascot chips (You purple / Pancake stack) labelled with the
 *    role + sub-role in inverted-surface pills.
 *  - "The org" eyebrow.
 *  - Horizontal snap-scroll carousel of dept cards (Growth, Engineering,
 *    Operations) with a dots indicator under it; one card visible at a
 *    time so the role rows stay readable.
 *  - "Tailor the org to your needs" closing card.
 *
 * The desktop component (`HomeOrgDiagram`) is hidden via CSS at <lg.
 */
"use client";

import { useEffect, useRef, useState } from "react";

import { LIVE_INITIAL_DEPTS, type OrgDotTone } from "@/components/sections/home/orgLiveData";

const DOT_CLASS: Record<OrgDotTone, string> = {
  positive: "home-org-mobile-row__dot--positive",
  warning: "home-org-mobile-row__dot--warning",
  negative: "home-org-mobile-row__dot--negative",
};

function FounderAvatar() {
  return (
    <svg viewBox="0 0 108 108" aria-hidden focusable="false" className="home-org-mobile-mascot__svg">
      <rect width="108" height="108" rx="54" fill="var(--palette-purple-10, #efddf1)" />
      <g>
        <path
          d="M70.7992 43.5975C72.1483 59.1754 65.1894 74.0014 49.5981 75.4872C33.9421 76.979 24.4667 63.8761 23.1042 48.1425C21.7417 32.4089 28.8112 17.7294 44.4672 16.2375C60.0585 14.7517 69.4502 28.0197 70.7992 43.5975Z"
          fill="var(--palette-purple-30, #ba8bff)"
        />
        <path
          d="M59.8224 148.311C38.4258 154.044 16.024 148.002 10.0967 126.621C4.14489 105.151 20.08 88.6935 41.6905 82.903C63.301 77.1125 85.5258 83.3447 91.4776 104.815C97.4049 126.196 81.2189 142.578 59.8224 148.311Z"
          fill="var(--palette-purple-30, #ba8bff)"
        />
        <path
          d="M47.6222 46.0657C47.9529 49.8841 46.5381 53.4905 43.2713 53.8018C39.991 54.1144 37.9628 50.8745 37.6288 47.018C37.2949 43.1614 38.7333 39.5912 42.0136 39.2786C45.2805 38.9673 47.2916 42.2472 47.6222 46.0657Z"
          fill="var(--palette-chrome-100, #2c002a)"
        />
        <path
          d="M64.9917 43.682C65.2504 46.6698 64.1434 49.4918 61.5872 49.7354C59.0204 49.98 57.4334 47.4449 57.1721 44.4272C56.9107 41.4095 58.0363 38.6159 60.6031 38.3713C63.1593 38.1277 64.7329 40.6942 64.9917 43.682Z"
          fill="var(--palette-chrome-100, #2c002a)"
        />
      </g>
    </svg>
  );
}

export function HomeOrgDiagramMobile() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Engineering middle by default

  // Track which dept card is most centered in the carousel.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      const cards = track.querySelectorAll<HTMLElement>(".home-org-mobile-card");
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
    // Center the middle (Engineering) card on mount so it matches the comp.
    requestAnimationFrame(() => {
      const cards = track.querySelectorAll<HTMLElement>(".home-org-mobile-card");
      const target = cards[1];
      if (target) {
        const offset = target.offsetLeft - (track.clientWidth - target.clientWidth) / 2;
        track.scrollTo({ left: offset, behavior: "auto" });
      }
      update();
    });
    return () => track.removeEventListener("scroll", update);
  }, []);

  function scrollToIndex(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(".home-org-mobile-card");
    const target = cards[i];
    if (!target) return;
    const offset = target.offsetLeft - (track.clientWidth - target.clientWidth) / 2;
    track.scrollTo({ left: offset, behavior: "smooth" });
  }

  return (
    <div className="home-org-mobile">
      {/* Speech bubble — Slack-style hint between the cofounders. */}
      <div className="home-org-mobile-bubble" aria-hidden>
        <p>
          We need a dedicated
          <br />
          QA tester
        </p>
      </div>

      {/* Mascot row — You purple person + Pancake monster + dotted connector. */}
      <div className="home-org-mobile-pair">
        <div className="home-org-mobile-mascot home-org-mobile-mascot--you">
          <div className="home-org-mobile-mascot__icon">
            <FounderAvatar />
          </div>
          <div className="home-org-mobile-mascot__chip">
            <p className="home-org-mobile-mascot__title">You</p>
            <p className="home-org-mobile-mascot__sub">The founder</p>
          </div>
        </div>

        <svg
          className="home-org-mobile-pair__connector"
          viewBox="0 0 80 40"
          aria-hidden
          focusable="false"
        >
          <path
            d="M2 32 Q 40 -10 78 32"
            fill="none"
            stroke="var(--palette-chrome-70, #b6a4ad)"
            strokeWidth="2"
            strokeDasharray="1 8"
            strokeLinecap="round"
          />
        </svg>

        <div className="home-org-mobile-mascot home-org-mobile-mascot--pancake">
          <div className="home-org-mobile-mascot__icon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pancake-monster.png" alt="" width={108} height={108} />
          </div>
          <div className="home-org-mobile-mascot__chip">
            <p className="home-org-mobile-mascot__title">Pancake</p>
            <p className="home-org-mobile-mascot__sub">Your co-founder</p>
          </div>
        </div>
      </div>

      <p className="home-org-mobile-eyebrow">The org</p>

      {/* Horizontal snap carousel — one dept card per viewport. */}
      <div className="home-org-mobile-carousel">
        <div ref={trackRef} className="home-org-mobile-carousel__track">
          {LIVE_INITIAL_DEPTS.map((dept) => (
            <article
              key={dept.surface}
              className={`home-org-mobile-card home-org-mobile-card--${dept.surface}`}
            >
              <h3 className="home-org-mobile-card__title">{dept.title}</h3>
              <ul className="home-org-mobile-card__rows">
                {dept.rows.slice(0, 3).map((row) => (
                  <li key={row.label} className="home-org-mobile-row">
                    <span className={`home-org-mobile-row__dot ${DOT_CLASS[row.dot]}`} />
                    <span className="home-org-mobile-row__label">{row.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Dots indicator. */}
        <div className="home-org-mobile-dots" role="tablist" aria-label="Departments">
          {LIVE_INITIAL_DEPTS.map((dept, i) => (
            <button
              key={dept.surface}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={dept.title}
              className={`home-org-mobile-dot ${i === activeIndex ? "home-org-mobile-dot--active" : ""}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Tailor card — Figma `596:3020`. */}
      <article className="home-org-mobile-tailor">
        <h3 className="home-org-mobile-tailor__title">Tailor the org to your needs</h3>
        <p className="home-org-mobile-tailor__body">
          Add, remove, or customise agents as you see fit!
        </p>
      </article>
    </div>
  );
}
