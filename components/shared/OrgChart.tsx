"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { HiOutlineUser } from "react-icons/hi2";
import { orgChart } from "@/lib/copy";

const CEO_PINK = "#FF7B9C";
const RUNNING_GREEN = "#22C55E";

type ConnectorGeom = {
  trunk: { x: number; y1: number; y2: number };
  hBar: { x1: number; x2: number; y: number };
  stems: { x: number; yTop: number; yBottom: number }[];
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function geomKey(g: ConnectorGeom) {
  return JSON.stringify({
    trunk: {
      x: round1(g.trunk.x),
      y1: round1(g.trunk.y1),
      y2: round1(g.trunk.y2),
    },
    hBar: {
      x1: round1(g.hBar.x1),
      x2: round1(g.hBar.x2),
      y: round1(g.hBar.y),
    },
    stems: g.stems.map((s) => ({
      x: round1(s.x),
      yTop: round1(s.yTop),
      yBottom: round1(s.yBottom),
    })),
  });
}

/** Short vertical double arrow between You and CEO (fixed layout, no measure) */
function YouCeoBidirectionalArrow() {
  return (
    <svg
      width={14}
      height={20}
      viewBox="0 0 14 20"
      className="shrink-0 overflow-visible"
      aria-hidden
    >
      <path d="M7 2 L3 6 L11 6 Z" fill="#0a0a0a" />
      <path
        d="M7 6 L7 14"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path d="M7 18 L3 14 L11 14 Z" fill="#0a0a0a" />
    </svg>
  );
}

function RunningDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-45"
        style={{ backgroundColor: RUNNING_GREEN }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ backgroundColor: RUNNING_GREEN }}
      />
    </span>
  );
}

export function OrgChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ceoRef = useRef<HTMLDivElement>(null);
  const clustersRowRef = useRef<HTMLDivElement>(null);
  const clusterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastGeomKey = useRef<string | null>(null);
  const [geom, setGeom] = useState<ConnectorGeom | null>(null);

  const clusters = orgChart.clusters;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let rafScheduled = false;
    function scheduleMeasure() {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        if (!cancelled) measure();
      });
    }

    function measure() {
      if (cancelled) return;
      const c = containerRef.current;
      const ceoEl = ceoRef.current;
      const row = clustersRowRef.current;
      if (!c || !ceoEl || !row) return;

      const cr = c.getBoundingClientRect();
      const ceoR = ceoEl.getBoundingClientRect();
      const rowR = row.getBoundingClientRect();

      const gapMidY = (ceoR.bottom + rowR.top) / 2 - cr.top;
      const ceoX = ceoR.left + ceoR.width / 2 - cr.left;
      const y1Trunk = ceoR.bottom - cr.top;

      const hx1 = rowR.left - cr.left;
      const hx2 = rowR.right - cr.left;

      const stems: ConnectorGeom["stems"] = [];
      const barHalf = 1.5;
      const stemTop = gapMidY + barHalf;

      for (let i = 0; i < clusters.length; i++) {
        const zone = clusterRefs.current[i];
        if (!zone) continue;
        const zr = zone.getBoundingClientRect();
        const x = zr.left + zr.width / 2 - cr.left;
        const yBottom = zr.top - cr.top;
        stems.push({ x, yTop: stemTop, yBottom });
      }

      const next: ConnectorGeom = {
        trunk: { x: ceoX, y1: y1Trunk, y2: gapMidY },
        hBar: { x1: hx1, x2: hx2, y: gapMidY },
        stems,
      };
      const key = geomKey(next);
      if (lastGeomKey.current === key) return;
      lastGeomKey.current = key;
      setGeom(next);
    }

    measure();
    const id = requestAnimationFrame(() => {
      if (!cancelled) measure();
    });

    /* No ResizeObserver — it can thrash with layout + setState in dev and trigger
     * “missing required error components” / infinite refresh. Window resize only. */
    window.addEventListener("resize", scheduleMeasure);
    const onOrientation = () => scheduleMeasure();
    window.addEventListener("orientationchange", onOrientation);
    const fonts = document.fonts;
    let fontDone: Promise<unknown> | undefined;
    if (fonts?.ready) {
      fontDone = fonts.ready.then(() => {
        if (!cancelled) scheduleMeasure();
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", onOrientation);
      void fontDone;
    };
  }, [clusters.length]);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-semibold text-black sm:text-4xl">
          {orgChart.title}
        </h2>

        <div
          ref={containerRef}
          className="relative mt-12 min-h-[8rem] pt-4 sm:mt-14 sm:min-h-[9rem] sm:pt-5"
        >
          <svg
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
            aria-hidden
          >
            {geom ? (
              <>
                <line
                  x1={geom.trunk.x}
                  y1={geom.trunk.y1}
                  x2={geom.trunk.x}
                  y2={geom.trunk.y2}
                  stroke="#0a0a0a"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={geom.hBar.x1}
                  y1={geom.hBar.y}
                  x2={geom.hBar.x2}
                  y2={geom.hBar.y}
                  stroke="#0a0a0a"
                  strokeWidth={3}
                  strokeLinecap="butt"
                  vectorEffect="non-scaling-stroke"
                />
                {geom.stems.map((s, i) => (
                  <line
                    key={i}
                    x1={s.x}
                    y1={s.yTop}
                    x2={s.x}
                    y2={s.yBottom}
                    stroke="#0a0a0a"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </>
            ) : null}
          </svg>

          <div className="relative z-[20] flex w-full flex-col items-center">
            {/*
              items-stretch + w-full so the arrow row spans the same width as CEO;
              You stays w-fit and mx-auto so the arrow centers on the column, not on the icon.
            */}
            <div className="mx-auto flex w-full max-w-[300px] flex-col items-stretch sm:max-w-[340px]">
              <div className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-theme brut-border bg-[#fffef8] px-3 py-2 sm:px-4 sm:py-2.5">
                <HiOutlineUser
                  className="h-6 w-6 shrink-0 text-black sm:h-7 sm:w-7"
                  aria-hidden
                />
                <p className="font-display text-base font-bold text-black sm:text-lg md:text-xl">
                  {orgChart.youLabel}
                </p>
              </div>
              <div className="flex w-full justify-center pt-2.5 pb-2 sm:pt-3 sm:pb-2.5">
                <YouCeoBidirectionalArrow />
              </div>
            </div>
            <div
              ref={ceoRef}
              className="mx-auto w-full max-w-[300px] rounded-theme brut-border px-4 py-3 text-center sm:max-w-[340px] sm:px-5 sm:py-4"
              style={{ backgroundColor: CEO_PINK }}
            >
              <p className="font-display text-lg font-bold uppercase tracking-wide text-black sm:text-xl md:text-2xl">
                {orgChart.ceoLabel}
              </p>
            </div>

            <div className="h-8 sm:h-10" aria-hidden />

            <div
              ref={clustersRowRef}
              className="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3"
            >
              {clusters.map((cluster, i) => (
                <div
                  key={cluster.id}
                  ref={(el) => {
                    clusterRefs.current[i] = el;
                  }}
                  className="brut-lift relative flex min-h-0 flex-1 flex-col rounded-[12px] border-2 border-dashed border-black p-3 pb-4 pt-9 sm:p-4 sm:pb-4 sm:pt-10"
                  style={{ backgroundColor: cluster.tint }}
                >
                  <span className="absolute left-3 top-3 font-mono text-[12px] font-bold uppercase tracking-wide text-black sm:left-4 sm:top-3.5">
                    {cluster.label}
                  </span>
                  <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {cluster.agents.map((name) => (
                      <div
                        key={name}
                        className="flex min-h-[2.75rem] items-center gap-2 rounded-theme brut-border bg-[#fffef8] px-2 py-1.5"
                      >
                        <RunningDot />
                        <span className="text-left text-[10px] font-semibold leading-tight text-black sm:text-[11px]">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-center font-mono text-[10px] font-medium uppercase tracking-wide text-[#666] sm:mt-4 sm:text-[11px]">
                    {orgChart.moreComingSoon}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ul className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3 sm:items-stretch">
          {orgChart.features.map((f) => (
            <li
              key={f.title}
              className="flex h-full min-h-[9.5rem] flex-col rounded-theme brut-border bg-[#fffef8] p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex shrink-0 select-none items-center justify-center font-mono text-sm leading-none text-black"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-sm font-bold leading-snug text-black">
                  {f.title}
                </span>
              </div>
              <p className="mt-3 text-sm font-normal leading-snug text-[#404040]">
                {f.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
