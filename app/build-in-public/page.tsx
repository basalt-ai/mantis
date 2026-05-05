/**
 * Build in Public — live signup / ambassador metrics fetched from Airtable
 * (`getMetrics`). Page chrome (nav, footer, section header) uses the phase-3
 * home design system; the dashboard's chart/KPI cards have been restyled to
 * match (Aeonik Fono labels, 32 px squircle cards, brand-pink fills).
 */
import type { Metadata } from "next";

import { MetricsDashboard } from "@/components/metrics/MetricsDashboard";
import { HomeNav } from "@/components/sections/home/HomeNav";
import { Footer } from "@/components/shared/Footer";
import { H2 } from "@/components/ui/Headings";
import { getMetrics } from "@/lib/metrics";

export const metadata: Metadata = {
  title: "Build in Public — Pancake",
  description: "Live signup and ambassador metrics for Pancake.",
};

// Always fetch fresh data from Airtable on request.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BuildInPublicPage() {
  let metrics;
  let error: string | null = null;
  try {
    metrics = await getMetrics();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <main className="min-h-screen">
      <HomeNav />
      <section className="build-in-public-section" aria-labelledby="bip-heading">
        <div className="build-in-public-section__inner">
          <header className="build-in-public-section__header">
            <H2 id="bip-heading" className="heading build-in-public-section__title text-center">
              Building in public
            </H2>
            <p className="build-in-public-section__lede text-center">
              Live signup and ambassador metrics, straight from the source.
            </p>
          </header>

          {error ? (
            <div className="build-in-public-error">
              <p className="build-in-public-error__title">Data unavailable</p>
              <p className="build-in-public-error__body">Could not load metrics. {error}</p>
            </div>
          ) : metrics ? (
            <MetricsDashboard metrics={metrics} />
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  );
}
