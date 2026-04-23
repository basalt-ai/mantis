import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
      <header
        className="sticky top-0 z-40 !shadow-none backdrop-blur-md"
        style={{
          borderBottom: "3px solid var(--border-color)",
          background: "#fffef8",
        }}
      >
        <div className="mx-auto flex min-h-[4rem] max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-[var(--text)]"
            aria-label="pancake home"
          >
            <Image
              src="/pancake-mark.png"
              alt=""
              width={512}
              height={512}
              priority
              className="h-7 w-7 shrink-0 sm:h-8 sm:w-8"
            />
            <span className="font-display text-[15px] font-bold leading-none tracking-tight text-[var(--text)] sm:text-[16px]">
              pancake
            </span>
            <span
              aria-hidden
              className="text-[var(--text-muted)] opacity-50"
              style={{ fontSize: "18px", lineHeight: 1 }}
            >
              |
            </span>
            <span className="font-display text-[13px] font-semibold text-[var(--text-muted)] sm:text-[14px]">
              Build in Public
            </span>
          </Link>
          <LiveBadge />
        </div>
      </header>

      {error ? (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-theme brut-border bg-[var(--surface)] p-6">
            <p className="font-display text-xl font-bold text-[var(--text)]">Data unavailable</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Could not load metrics. {error}
            </p>
          </div>
        </div>
      ) : metrics ? (
        <MetricsDashboard metrics={metrics} />
      ) : null}
    </main>
  );
}

function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[color:rgba(255,143,163,0.14)] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]"
      aria-label="Live"
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden />
      Live
    </span>
  );
}
