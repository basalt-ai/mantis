/**
 * Home page sections below the hero (`/`). Most illustrations are PNGs in `public/home-landing-*.png`
 * (regenerate: `FIGMA_ACCESS_TOKEN=… npm run figma:export-landing`). Org diagram is HTML (`HomeOrgDiagram`).
 */

import Link from "next/link";

import { HOME_PAGE_CONTAINER_CLASS } from "@/components/sections/home/home-layout";
import { HomeIntegrationsCloud } from "@/components/sections/home/HomeIntegrationsCloud";
import { HomeLandingControl } from "@/components/sections/home/HomeLandingControl";
import { HomeLandingFeatures } from "@/components/sections/home/HomeLandingFeatures";
import { HomeLandingTestimonials } from "@/components/sections/home/HomeLandingTestimonials";
import { HomeOrgDiagram } from "@/components/sections/home/HomeOrgDiagram";
import { SlackUI } from "@/components/shared/SlackUI";
import { H2 } from "@/components/ui/Headings";

/** Figma `428:15162` — U+2028 line break before “company”. */
const CLOSING_TITLE = "Make your \u2028company autonomous";

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
            <HomeIntegrationsCloud />
          </div>
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
          <HomeLandingFeatures />
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
          <div className="home-landing-section__figure home-landing-section__figure--slack">
            <SlackUI />
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
            <HomeLandingControl />
          </div>
        </div>
      </section>

      {/* Figma `428:15175` testimonials — heading lives in the centered
          container; the carousel band sits outside so it can run full-bleed. */}
      <section className="home-landing-section home-landing-section--testimonials" aria-labelledby="home-landing-testimonials-heading">
        <div className={`${HOME_PAGE_CONTAINER_CLASS} home-landing-section__inner home-landing-section__inner--testimonials`}>
          <header className="home-landing-section__header">
            <H2 id="home-landing-testimonials-heading" className="heading home-landing-section__title text-center">
              Take it from them
            </H2>
            <p className="home-landing-section__lede text-center">Here’s what our customers are saying</p>
          </header>
        </div>
        <HomeLandingTestimonials />
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
