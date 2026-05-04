"use client";

import type { RefObject } from "react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import {
  LIVE_INITIAL_DEPTS,
  ROLE_POOLS,
  type OrgDotTone,
  type OrgSurface,
} from "@/components/sections/home/orgLiveData";

type LivePhase = "pending" | "active";

type LiveRow = {
  id: string;
  label: string;
  phase: LivePhase;
  /** Preserves original Figma dot for seeded rows; recruited rows omit this. */
  baseDot?: OrgDotTone;
};

const ROW_CAP = 6;
const ROW_FLOOR = 2;
/** Per-block only — each surface draws a fresh delay in this range every cycle (no master tick). */
const BLOCK_DELAY_MIN_MS = 600;
const BLOCK_DELAY_MAX_MS = 1800;
const PENDING_TO_ACTIVE_S = 0.8;
const ADD_IN_DURATION = 0.58;
const ADD_SLIDE_MAX_PX = 168;
const REMOVE_SHAKE_S = 0.24;
const REMOVE_OUT_DURATION = 0.72;

function makeRowId(): string {
  return `org-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function initialDeptMap(): Record<OrgSurface, LiveRow[]> {
  const m = {} as Record<OrgSurface, LiveRow[]>;
  for (const d of LIVE_INITIAL_DEPTS) {
    m[d.surface] = d.rows.map((r) => ({
      id: makeRowId(),
      label: r.label,
      phase: "active",
      baseDot: r.dot,
    }));
  }
  return m;
}

function dotClassForLiveRow(row: LiveRow): OrgDotTone {
  if (row.baseDot !== undefined) return row.baseDot;
  return row.phase === "active" ? "positive" : "negative";
}

function visibleLabels(rows: LiveRow[]): Set<string> {
  return new Set(rows.map((r) => r.label));
}

function captureDeptRowRects(article: Element): Map<string, DOMRect> {
  const map = new Map<string, DOMRect>();
  article.querySelectorAll<HTMLElement>("[data-org-live-row]").forEach((el) => {
    const id = el.dataset.orgLiveRow;
    if (id) map.set(id, el.getBoundingClientRect());
  });
  return map;
}

function flipReflowRows(
  article: Element,
  before: Map<string, DOMRect>,
  duration = 0.32,
  ease: string = "power2.out",
): void {
  article.querySelectorAll<HTMLElement>("[data-org-live-row]").forEach((el) => {
    const id = el.dataset.orgLiveRow;
    if (!id) return;
    const prev = before.get(id);
    if (!prev) return;
    const next = el.getBoundingClientRect();
    const dy = prev.top - next.top;
    if (Math.abs(dy) < 0.75) return;
    gsap.fromTo(el, { y: dy }, { y: 0, duration, ease, overwrite: "auto" });
  });
}

function findRowEl(root: HTMLElement | null, surface: OrgSurface, id: string): HTMLElement | null {
  if (!root) return null;
  return root.querySelector<HTMLElement>(`article.home-org-diagram__dept--${surface} [data-org-live-row="${id}"]`);
}

function findDeptArticle(root: HTMLElement | null, surface: OrgSurface): HTMLElement | null {
  if (!root) return null;
  return root.querySelector<HTMLElement>(`article.home-org-diagram__dept--${surface}`);
}

type HomeOrgLiveRowsProps = {
  scrollRootRef: RefObject<HTMLElement | null>;
};

const SURFACES: OrgSurface[] = ["growth", "engineering", "operations"];

export function HomeOrgLiveRows({ scrollRootRef }: HomeOrgLiveRowsProps) {
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const [deptRows, setDeptRows] = useState<Record<OrgSurface, LiveRow[]>>(() => initialDeptMap());
  const deptRowsRef = useRef(deptRows);
  useLayoutEffect(() => {
    deptRowsRef.current = deptRows;
  }, [deptRows]);

  const liveEnabledRef = useRef(false);
  const timerBySurfaceRef = useRef<Record<OrgSurface, ReturnType<typeof setTimeout> | null>>({
    growth: null,
    engineering: null,
    operations: null,
  });
  const delayedCallsRef = useRef<gsap.core.Tween[]>([]);

  const runBlockRef = useRef<(surface: OrgSurface) => void>(() => {});
  const armBlockRef = useRef<(surface: OrgSurface) => void>(() => {});

  const clearBlockTimer = useCallback((surface: OrgSurface) => {
    const t = timerBySurfaceRef.current[surface];
    if (t != null) {
      clearTimeout(t);
      timerBySurfaceRef.current[surface] = null;
    }
  }, []);

  const clearAllBlockTimers = useCallback(() => {
    for (const s of SURFACES) clearBlockTimer(s);
  }, [clearBlockTimer]);

  const killDelayedCalls = useCallback(() => {
    delayedCallsRef.current.forEach((d) => d.kill());
    delayedCallsRef.current = [];
  }, []);

  const armBlock = useCallback(
    (surface: OrgSurface) => {
      clearBlockTimer(surface);
      if (!liveEnabledRef.current) return;
      const delay =
        BLOCK_DELAY_MIN_MS + Math.random() * (BLOCK_DELAY_MAX_MS - BLOCK_DELAY_MIN_MS);
      timerBySurfaceRef.current[surface] = setTimeout(() => {
        timerBySurfaceRef.current[surface] = null;
        try {
          runBlockRef.current(surface);
        } finally {
          armBlockRef.current(surface);
        }
      }, delay);
    },
    [clearBlockTimer],
  );

  const runBlock = useCallback(
    (surface: OrgSurface) => {
      const root = scrollRootRef.current;
      if (!liveEnabledRef.current) return;

      if (!root) return;

      const rows = deptRowsRef.current[surface];
      const vis = visibleLabels(rows);
      const pool = ROLE_POOLS[surface].filter((l) => !vis.has(l));
      const addOk = rows.length < ROW_CAP && pool.length > 0;
      const actives = rows.filter((r) => r.phase === "active");
      const pendings = rows.filter((r) => r.phase === "pending");
      const removeOk =
        rows.length > ROW_FLOOR && (actives.length > 0 || pendings.length > 0);
      const targetPool = actives.length > 0 ? actives : pendings;

      let doAdd: boolean;
      if (addOk && removeOk) doAdd = Math.random() < 0.5;
      else if (addOk) doAdd = true;
      else if (removeOk) doAdd = false;
      else return;

      if (doAdd && pool.length === 0) {
        if (!removeOk) return;
        doAdd = false;
      }
      if (!doAdd && targetPool.length === 0) {
        if (!addOk) return;
        doAdd = true;
      }

      if (doAdd) {
        const article = findDeptArticle(root, surface);
        const beforeRects = article ? captureDeptRowRects(article) : new Map<string, DOMRect>();
        const sampleRow = article?.querySelector<HTMLElement>(".home-org-diagram__row");
        const rowH = sampleRow ? Math.max(20, sampleRow.getBoundingClientRect().height) : 28;
        const deptH = article ? article.getBoundingClientRect().height : rowH * 4;
        const enterY = -Math.min(
          ADD_SLIDE_MAX_PX,
          Math.max(rowH * 2.2 + 10, deptH * 0.38),
        );

        const label = pool[Math.floor(Math.random() * pool.length)]!;
        const id = makeRowId();

        setDeptRows((prev) => ({
          ...prev,
          [surface]: [{ id, label, phase: "pending" }, ...prev[surface]],
        }));

        queueMicrotask(() => {
          if (!article) return;
          flipReflowRows(article, beforeRects, ADD_IN_DURATION, "power3.out");
          const el = findRowEl(root, surface, id);
          if (!el) return;
          gsap.fromTo(
            el,
            { y: enterY, opacity: 0.08 },
            {
              y: 0,
              opacity: 1,
              duration: ADD_IN_DURATION,
              ease: "power3.out",
              overwrite: "auto",
            },
          );
          const dc = gsap.delayedCall(PENDING_TO_ACTIVE_S, () => {
            setDeptRows((prev) => ({
              ...prev,
              [surface]: prev[surface].map((r) =>
                r.id === id && r.phase === "pending" ? { ...r, phase: "active" } : r,
              ),
            }));
          });
          delayedCallsRef.current.push(dc);
        });
        return;
      }

      const victim = targetPool[Math.floor(Math.random() * targetPool.length)]!;
      const article = findDeptArticle(root, surface);
      const rowEl = findRowEl(root, surface, victim.id);
      if (!article || !rowEl) return;

      const beforeRects = captureDeptRowRects(article);
      const dot = rowEl.querySelector<HTMLElement>(".home-org-diagram__dot");
      const slideX = Math.max(56, article.getBoundingClientRect().width * 0.28);

      gsap.set(rowEl, { willChange: "transform, filter" });

      const tl = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
          gsap.set(rowEl, { clearProps: "willChange" });
          setDeptRows((prev) => ({
            ...prev,
            [surface]: prev[surface].filter((r) => r.id !== victim.id),
          }));
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              flipReflowRows(article, beforeRects, 0.42, "power3.out");
            });
          });
        },
      });

      tl.to(rowEl, { x: 5, duration: 0.04, ease: "none", repeat: 5, yoyo: true }, 0);

      if (dot) {
        const flicker: OrgDotTone[] = ["negative", "positive", "negative", "positive", "negative"];
        let t = REMOVE_SHAKE_S * 0.35;
        flicker.forEach((st) => {
          tl.call(
            () => {
              dot.className = `home-org-diagram__dot home-org-diagram__dot--${st}`;
            },
            undefined,
            t,
          );
          t += 0.045;
        });
      }

      tl.to(
        rowEl,
        {
          x: slideX,
          opacity: 0,
          filter: "blur(6px)",
          duration: REMOVE_OUT_DURATION,
          ease: "power2.inOut",
        },
        REMOVE_SHAKE_S * 0.55,
      );
    },
    [scrollRootRef],
  );

  runBlockRef.current = runBlock;
  armBlockRef.current = armBlock;

  useGSAP(
    () => {
      if (reducedMotion) return;

      let st: ScrollTrigger | null = null;
      let cancelled = false;
      let raf0 = 0;
      let raf1 = 0;

      const startLive = () => {
        liveEnabledRef.current = true;
        for (const s of SURFACES) {
          armBlockRef.current(s);
        }
      };

      const stopLive = () => {
        liveEnabledRef.current = false;
        clearAllBlockTimers();
        killDelayedCalls();
      };

      const syncLiveFromScrollPosition = () => {
        if (cancelled || !st) return;
        ScrollTrigger.refresh();
        // Only arm when active. Do NOT call stopLive() here — after refresh(), isActive can
        // briefly read false while the diagram is still on screen; that was killing timers +
        // pending→active delayedCalls mid-session (freeze after several adds).
        if (st.isActive) startLive();
      };

      const attach = () => {
        const root = scrollRootRef.current;
        if (!root) return false;

        st = ScrollTrigger.create({
          trigger: root,
          /** While any part of the diagram intersects the viewport (stable when the block grows). */
          start: "top bottom",
          end: "bottom top",
          invalidateOnRefresh: true,
          onEnter: startLive,
          onEnterBack: startLive,
          onLeave: stopLive,
          onLeaveBack: stopLive,
        });

        // If the org block is already past `start` when the trigger mounts, `onEnter` never fires
        // (classic ScrollTrigger gotcha). Mirror enter/leave from measured `isActive` instead.
        syncLiveFromScrollPosition();
        raf0 = requestAnimationFrame(() => {
          raf1 = requestAnimationFrame(syncLiveFromScrollPosition);
        });

        return true;
      };

      if (!attach()) {
        raf0 = requestAnimationFrame(() => {
          if (cancelled) return;
          if (!attach()) {
            raf1 = requestAnimationFrame(() => {
              if (cancelled) return;
              attach();
            });
          }
        });
      }

      return () => {
        cancelled = true;
        cancelAnimationFrame(raf0);
        cancelAnimationFrame(raf1);
        st?.kill();
        st = null;
        stopLive();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tick logic uses refs; avoid recreating ScrollTrigger
    { scope: scrollRootRef, dependencies: [reducedMotion, killDelayedCalls, clearAllBlockTimers] },
  );

  if (reducedMotion) {
    return (
      <>
        {LIVE_INITIAL_DEPTS.map((dept) => (
          <article
            key={dept.title}
            className={`home-org-diagram__dept home-org-diagram__dept--${dept.surface} home-org-diagram__abs`}
          >
            <h3 className="home-org-diagram__dept-title">{dept.title}</h3>
            <div className="home-org-diagram__rows">
              {dept.rows.map((row) => (
                <div key={row.label} className="home-org-diagram__row">
                  <span className={`home-org-diagram__dot home-org-diagram__dot--${row.dot}`} aria-hidden />
                  <span className="home-org-diagram__row-label">{row.label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </>
    );
  }

  return (
    <>
      {LIVE_INITIAL_DEPTS.map((dept) => (
        <article
          key={dept.title}
          className={`home-org-diagram__dept home-org-diagram__dept--${dept.surface} home-org-diagram__abs`}
        >
          <h3 className="home-org-diagram__dept-title">{dept.title}</h3>
          <div className="home-org-diagram__rows" aria-live="polite">
            {deptRows[dept.surface].map((row) => (
              <div key={row.id} className="home-org-diagram__row" data-org-live-row={row.id}>
                <span
                  className={`home-org-diagram__dot home-org-diagram__dot--${dotClassForLiveRow(row)}`}
                  aria-hidden
                />
                <span className="home-org-diagram__row-label">{row.label}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </>
  );
}
