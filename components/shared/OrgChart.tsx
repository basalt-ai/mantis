"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { orgChart } from "@/lib/copy";

const CEO_PINK = "#FF7B9C";
const BRUT_SHADOW = "4px 4px 0 0 #0a0a0a";
const RUNNING_GREEN = "#22C55E";

type ConnectorGeom = {
  trunk: { x: number; y1: number; y2: number };
  hBar: { x1: number; x2: number; y: number };
  stems: { x: number; yTop: number; yBottom: number }[];
};

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
  const [geom, setGeom] = useState<ConnectorGeom | null>(null);

  const clusters = orgChart.clusters;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
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

      setGeom({
        trunk: { x: ceoX, y1: y1Trunk, y2: gapMidY },
        hBar: { x1: hx1, x2: hx2, y: gapMidY },
        stems,
      });
    }

    measure();
    const id = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(container);

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [clusters.length]);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-semibold text-black sm:text-4xl">
          {orgChart.title}
        </h2>

        <div ref={containerRef} className="relative mt-12 sm:mt-14">
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
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

          <div className="relative z-10 flex flex-col items-center">
            <div
              ref={ceoRef}
              className="mx-auto w-full max-w-[300px] border-[3px] border-black px-4 py-3 text-center sm:max-w-[340px] sm:px-5 sm:py-4"
              style={{
                backgroundColor: CEO_PINK,
                borderRadius: 0,
                boxShadow: BRUT_SHADOW,
              }}
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
                  className="relative flex min-h-0 flex-1 flex-col rounded-[12px] border-2 border-dashed border-black p-3 pb-4 pt-9 sm:p-4 sm:pb-4 sm:pt-10"
                  style={{ backgroundColor: cluster.tint }}
                >
                  <span className="absolute left-3 top-3 font-mono text-[12px] font-bold uppercase tracking-wide text-black sm:left-4 sm:top-3.5">
                    {cluster.label}
                  </span>
                  <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {cluster.agents.map((name) => (
                      <div
                        key={name}
                        className="flex min-h-[2.75rem] items-center gap-2 border-[3px] border-black bg-[#fffef8] px-2 py-1.5"
                        style={{
                          borderRadius: 0,
                          boxShadow: "3px 3px 0 0 #0a0a0a",
                        }}
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
              className="flex h-full min-h-[9.5rem] flex-col border-[3px] border-black bg-[#fffef8] p-4"
              style={{ borderRadius: 0, boxShadow: BRUT_SHADOW }}
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
