import type { Metadata } from "next";
import { Footer } from "@/components/shared/Footer";
import { Nav } from "@/components/shared/Nav";
import { MetricsDashboard } from "@/components/metrics/MetricsDashboard";
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
    <main className="min-h-screen bg-[var(--bg)]">
      <Nav />

      {error ? (
        <div className="mx-auto max-w-6xl px-4 pt-[4.5rem] pb-16 sm:px-6">
          <div className="rounded-theme brut-border bg-[var(--surface)] p-6">
            <p className="font-display text-xl font-bold text-[var(--text)]">Data unavailable</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Could not load metrics. {error}
            </p>
          </div>
        </div>
      ) : metrics ? (
        <div className="pt-[4.5rem]">
          <MetricsDashboard metrics={metrics} />
        </div>
      ) : null}
      <Footer />
    </main>
  );
}
