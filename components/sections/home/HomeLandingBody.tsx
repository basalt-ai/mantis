/**
 * Home page sections below the hero (`/`). Most illustrations are PNGs in `public/home-landing-*.png`
 * (regenerate: `FIGMA_ACCESS_TOKEN=… npm run figma:export-landing`). Org diagram is HTML (`HomeOrgDiagram`).
 */

import Link from "next/link";

import { HOME_PAGE_CONTAINER_CLASS } from "@/components/sections/home/home-layout";
import { HomeOrgDiagram } from "@/components/sections/home/HomeOrgDiagram";
import { H2, H3 } from "@/components/ui/Headings";

/** Figma `428:15162` — U+2028 line break before “company”. */
const CLOSING_TITLE = "Make your \u2028company autonomous";

const TESTIMONIALS = [
  {
    quote:
      "Day 14 of the pancake experiment: my engineering agent has shipped 38 PRs, my recruiter agent screened 412 candidates, and my CFO agent is actually scary good at modeling.",
  },
  {
    quote:
      "I asked @pancake to \"run my entire content engine\" and it just… did. Calendar, briefs, drafts, scheduling, analytics. I am the bottleneck now.",
  },
  {
    quote:
      "Hired 4 pancake agents on Friday. Came back Monday to a launched landing page, 11 closed deals, and an inbox at zero. I genuinely don't know what to do with my time.",
  },
  {
    quote:
      "The kill switch works. I tested it. My whole org froze mid-sentence, then resumed exactly where it left off when I un-paused. This is actually production software.",
  },
] as const;

export function HomeLandingBody() {
  return (
    <div className="home-landing">
      {/* Figma `428:14922` org */}
      <section className="home-landing-section home-landing-section--alt" aria-labelledby="home-landing-org-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner`}>
          <header className="home-landing-section__header">
            <H2 id="home-landing-org-heading" className="heading home-landing-section__title text-center">
              An entire org working for you
            </H2>
            <p className="home-landing-section__lede text-center">Even when you’re asleep</p>
          </header>
          <div className="home-landing-section__figure">
            <HomeOrgDiagram />
          </div>
        </div>
      </section>

      {/* Figma `428:15015` integrations */}
      <section className="home-landing-section" aria-labelledby="home-landing-integrations-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner`}>
          <header className="home-landing-section__header">
            <H2 id="home-landing-integrations-heading" className="heading home-landing-section__title text-center">
              Endless integrations
            </H2>
            <p className="home-landing-section__lede text-center">Plug in your stack, let the agents do the rest.</p>
          </header>
          <div className="home-landing-section__figure">
            {/* eslint-disable-next-line @next/next/no-img-element -- Figma raster export (MCP screenshot) */}
            <img
              className="home-landing-section__img"
              src="/home-landing-integrations-art.png"
              alt=""
              width={1024}
              height={658}
              decoding="async"
              loading="lazy"
            />
          </div>
          <p className="home-landing-section__caption text-center">
            Connect your tools. Your agents read, write, ship, and sell through them — like an employee would.
          </p>
        </div>
      </section>

      {/* Figma `428:15087` features */}
      <section className="home-landing-section home-landing-section--alt" aria-labelledby="home-landing-features-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner`}>
          <header className="home-landing-section__header">
            <H2 id="home-landing-features-heading" className="heading home-landing-section__title text-center">
              Naturally works as you’d expect
            </H2>
            <p className="home-landing-section__lede text-center">Pancake comes with modern day features.</p>
          </header>
          <div className="home-landing-features">
            <article className="home-landing-feature-card">
              <p className="home-landing-feature-card__eyebrow">.md</p>
              <H3 className="heading home-landing-feature-card__title">Markdown-configured</H3>
              <p className="home-landing-feature-card__body">
                Every agent, role, and workflow defined in .md files you control
              </p>
            </article>
            <article className="home-landing-feature-card">
              <H3 className="heading home-landing-feature-card__title">Context-aware</H3>
              <p className="home-landing-feature-card__body">
                Agents pull context from your Notion, docs, and meeting notes. They know your business.
              </p>
            </article>
            <article className="home-landing-feature-card">
              <p className="home-landing-feature-card__eyebrow">24/7</p>
              <H3 className="heading home-landing-feature-card__title">Always on</H3>
              <p className="home-landing-feature-card__body">Your agent org runs 24/7 — no downtime, no sick days</p>
            </article>
          </div>
        </div>
      </section>

      {/* Figma `428:15120` slack */}
      <section className="home-landing-section" aria-labelledby="home-landing-slack-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner`}>
          <header className="home-landing-section__header">
            <H2 id="home-landing-slack-heading" className="heading home-landing-section__title text-center">
              Your agents live in Slack
            </H2>
            <p className="home-landing-section__lede text-center">They don’t wait to be asked.</p>
          </header>
          <div className="home-landing-section__figure">
            {/* eslint-disable-next-line @next/next/no-img-element -- Figma raster export (MCP screenshot) */}
            <img
              className="home-landing-section__img home-landing-section__img--rounded"
              src="/home-landing-slack-screenshot.png"
              alt=""
              width={1024}
              height={585}
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Figma `428:15125` control */}
      <section className="home-landing-section home-landing-section--alt" aria-labelledby="home-landing-control-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner`}>
          <header className="home-landing-section__header">
            <H2 id="home-landing-control-heading" className="heading home-landing-section__title text-center">
              You’re always in control
            </H2>
            <p className="home-landing-section__lede text-center">Jump in at any time, you always have the last word.</p>
          </header>
          <div className="home-landing-section__figure">
            {/* eslint-disable-next-line @next/next/no-img-element -- Figma raster export (MCP screenshot) */}
            <img
              className="home-landing-section__img home-landing-section__img--rounded"
              src="/home-landing-control-ui.png"
              alt=""
              width={1024}
              height={363}
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Figma `428:15175` testimonials */}
      <section className="home-landing-section" aria-labelledby="home-landing-testimonials-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner`}>
          <header className="home-landing-section__header">
            <H2 id="home-landing-testimonials-heading" className="heading home-landing-section__title text-center">
              Take it from them
            </H2>
            <p className="home-landing-section__lede text-center">Here’s what our customers are saying</p>
          </header>
          <div className="home-landing-testimonials">
            {TESTIMONIALS.map((t, index) => (
              <article key={index} className="home-landing-testimonial">
                <p className="home-landing-testimonial__quote">{t.quote}</p>
                <div className="home-landing-testimonial__meta">
                  <div>
                    <p className="home-landing-testimonial__name">Jules Reyes</p>
                    <p className="home-landing-testimonial__handle">@jules · 1d</p>
                  </div>
                  <p className="home-landing-testimonial__stats">321 replies · 821 reposts · 2.8k likes</p>
                  <p className="home-landing-testimonial__via">via X</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Figma `428:15160` closing CTA */}
      <section className="home-landing-section home-landing-section--alt home-landing-section--closing" aria-labelledby="home-landing-closing-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner home-landing-section__inner--closing`}>
          <h2 id="home-landing-closing-heading" className="heading home-landing-section__closing-title whitespace-pre-line text-center">
            {CLOSING_TITLE}
          </h2>
          <p className="home-landing-section__lede home-landing-section__lede--closing text-center">
            Sign up, write a markdown file, hire your first agent in 90 seconds. Free for up to 3 agents.
          </p>
          <div className="home-landing-closing-cta">
            <Link
              href="/signup"
              className="button inline-flex w-fit shrink-0 items-center justify-center no-underline"
              data-size="lg"
              prefetch={false}
            >
              Try for free
            </Link>
            <p className="home-landing-closing-cta__note">No credit card needed</p>
          </div>
        </div>
      </section>
    </div>
  );
}
