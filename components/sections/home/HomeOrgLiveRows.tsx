"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";

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
const BLOCK_DELAY_MIN_MS = 880;
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
    /** `false` — avoid killing concurrent transform tweens on the same row (e.g. exit x while reflow y). */
    gsap.fromTo(el, { y: dy }, { y: 0, duration, ease, overwrite: false });
  });
}

function findRowEl(root: HTMLElement | null, surface: OrgSurface, id: string): HTMLElement | null {
  const article = findDeptArticle(root, surface);
  if (!article) return null;
  const nodes = article.querySelectorAll<HTMLElement>("[data-org-live-row]");
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i]!;
    if (el.getAttribute("data-org-live-row") === id) return el;
  }
  return null;
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
  /** pending→active — plain timeouts (browser number handles) so GSAP never drops promotions. */
  const pendingPromoteTimersRef = useRef<Map<string, number>>(new Map());

  const runBlockRef = useRef<(surface: OrgSurface) => void>(() => {});
  const scheduleSurfaceNextRef = useRef<(surface: OrgSurface) => void>(() => {});
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

  const clearAllPendingPromoteTimers = useCallback(() => {
    pendingPromoteTimersRef.current.forEach((t) => clearTimeout(t));
    pendingPromoteTimersRef.current.clear();
  }, []);

  /** If exit GSAP never reaches onComplete, that surface would stop scheduling forever — force finish. */
  const removeFailsafeBySurfaceRef = useRef<Record<OrgSurface, number | null>>({
    growth: null,
    engineering: null,
    operations: null,
  });

  const clearRemoveFailsafe = useCallback((surface: OrgSurface) => {
    const t = removeFailsafeBySurfaceRef.current[surface];
    if (t != null) {
      clearTimeout(t);
      removeFailsafeBySurfaceRef.current[surface] = null;
    }
  }, []);

  const clearAllRemoveFailsafes = useCallback(() => {
    for (const s of SURFACES) clearRemoveFailsafe(s);
  }, [clearRemoveFailsafe]);

  /**
   * Schedule the next tick for one surface. Never chain from runBlock via try/finally: remove
   * timelines are async (~0.85s+); re-arming immediately caused overlapping ticks, overwrite kills,
   * and stuck “at cap” states.
   */
  const scheduleSurfaceNext = useCallback(
    (surface: OrgSurface) => {
      clearBlockTimer(surface);
      if (!liveEnabledRef.current) return;
      const delay =
        BLOCK_DELAY_MIN_MS + Math.random() * (BLOCK_DELAY_MAX_MS - BLOCK_DELAY_MIN_MS);
      console.log("[org-live] scheduleSurfaceNext", { surface, delayMs: Math.round(delay) });
      timerBySurfaceRef.current[surface] = setTimeout(() => {
        timerBySurfaceRef.current[surface] = null;
        runBlockRef.current(surface);
      }, delay);
    },
    [clearBlockTimer],
  );

  const runBlock = useCallback(
    (surface: OrgSurface) => {
      const root = scrollRootRef.current;
      if (!liveEnabledRef.current) {
        console.log("[org-live]", { surface, liveEnabled: false, early: "liveDisabled" });
        return;
      }

      if (!root) {
        scheduleSurfaceNextRef.current(surface);
        return;
      }

      const rows = deptRowsRef.current[surface];

      const vis = visibleLabels(rows);
      const pool = ROLE_POOLS[surface].filter((l) => !vis.has(l));
      const addOk = rows.length < ROW_CAP && pool.length > 0;
      /** Anything not explicitly pending counts as “active” for removal priority (avoids empty targetPool). */
      const actives = rows.filter((r) => r.phase !== "pending");
      const pendings = rows.filter((r) => r.phase === "pending");
      const removeOk = rows.length > ROW_FLOOR;
      let targetPool =
        actives.length > 0 ? actives : pendings.length > 0 ? pendings : rows.length > ROW_FLOOR ? rows : [];
      const atCap = rows.length >= ROW_CAP;

      console.log("[org-live]", {
        surface,
        liveEnabled: liveEnabledRef.current,
        rowsLength: rows.length,
        addOk,
        removeOk,
        atCap,
        scrollRootIsNull: !scrollRootRef.current,
      });

      let doAdd: boolean;
      if (atCap && removeOk) doAdd = false;
      else if (addOk && removeOk) doAdd = Math.random() < 0.5;
      else if (addOk) doAdd = true;
      else if (removeOk) doAdd = false;
      else {
        scheduleSurfaceNextRef.current(surface);
        return;
      }

      if (doAdd && pool.length === 0) {
        if (!removeOk) {
          scheduleSurfaceNextRef.current(surface);
          return;
        }
        doAdd = false;
      }
      if (!doAdd && targetPool.length === 0) {
        if (rows.length > ROW_FLOOR) {
          targetPool = rows;
        } else if (!addOk) {
          scheduleSurfaceNextRef.current(surface);
          return;
        } else {
          doAdd = true;
        }
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
          const prevT = pendingPromoteTimersRef.current.get(id);
          if (prevT != null) clearTimeout(prevT);
          const t = window.setTimeout(() => {
            pendingPromoteTimersRef.current.delete(id);
            setDeptRows((prev) => ({
              ...prev,
              [surface]: prev[surface].map((r) =>
                r.id === id && r.phase === "pending" ? { ...r, phase: "active" } : r,
              ),
            }));
          }, PENDING_TO_ACTIVE_S * 1000);
          pendingPromoteTimersRef.current.set(id, t);
        });
        scheduleSurfaceNextRef.current(surface);
        return;
      }

      const victim = targetPool[Math.floor(Math.random() * targetPool.length)]!;
      const article = findDeptArticle(root, surface);
      const rowEl = findRowEl(root, surface, victim.id);
      console.log("[org-live] remove attempt", { surface, victimId: victim.id, found: !!rowEl });
      if (!article || !rowEl) {
        scheduleSurfaceNextRef.current(surface);
        return;
      }

      const beforeRects = captureDeptRowRects(article);
      const dot = rowEl.querySelector<HTMLElement>(".home-org-diagram__dot");
      const slideX = Math.max(56, article.getBoundingClientRect().width * 0.28);

      gsap.set(rowEl, { willChange: "transform, opacity" });

      clearRemoveFailsafe(surface);
      removeFailsafeBySurfaceRef.current[surface] = window.setTimeout(() => {
        removeFailsafeBySurfaceRef.current[surface] = null;
        if (!liveEnabledRef.current) return;
        const stillThere = deptRowsRef.current[surface].some((r) => r.id === victim.id);
        if (stillThere) {
          gsap.killTweensOf(rowEl);
          gsap.set(rowEl, { clearProps: "transform,opacity,visibility,willChange" });
          setDeptRows((prev) => ({
            ...prev,
            [surface]: prev[surface].filter((r) => r.id !== victim.id),
          }));
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              flipReflowRows(article, beforeRects, 0.42, "power3.out");
            });
          });
        }
        scheduleSurfaceNextRef.current(surface);
      }, 2400);

      const tl = gsap.timeline({
        defaults: { overwrite: false },
        onInterrupt: () => {
          console.log("[org-live] exit interrupted", { surface, victimId: victim.id });
          clearRemoveFailsafe(surface);
          gsap.set(rowEl, { clearProps: "transform,opacity,visibility,willChange" });
          scheduleSurfaceNextRef.current(surface);
        },
        onComplete: () => {
          console.log("[org-live] exit complete", { surface, victimId: victim.id });
          clearRemoveFailsafe(surface);
          gsap.set(rowEl, { clearProps: "transform,opacity,visibility,willChange" });
          setDeptRows((prev) => ({
            ...prev,
            [surface]: prev[surface].filter((r) => r.id !== victim.id),
          }));
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              flipReflowRows(article, beforeRects, 0.42, "power3.out");
            });
          });
          scheduleSurfaceNextRef.current(surface);
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
          autoAlpha: 0,
          duration: REMOVE_OUT_DURATION,
          ease: "power2.inOut",
          force3D: true,
        },
        REMOVE_SHAKE_S * 0.55,
      );
    },
    [scrollRootRef, clearRemoveFailsafe],
  );

  scheduleSurfaceNextRef.current = scheduleSurfaceNext;
  runBlockRef.current = runBlock;
  armBlockRef.current = scheduleSurfaceNext;

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;

    /** Only arm timers once per “live” session — avoids IO/scroll churn clearing random delays every frame. */
    const startLive = () => {
      if (cancelled) return;
      if (liveEnabledRef.current) return;
      liveEnabledRef.current = true;
      for (const s of SURFACES) {
        armBlockRef.current(s);
      }
    };

    const pauseLive = () => {
      if (!liveEnabledRef.current) return;
      liveEnabledRef.current = false;
      clearAllBlockTimers();
      clearAllPendingPromoteTimers();
      clearAllRemoveFailsafes();
    };

    const onVisibility = () => {
      if (cancelled) return;
      if (document.visibilityState === "hidden") pauseLive();
      else startLive();
    };

    /**
     * Do NOT gate on viewport intersection for this block.
     * The diagram uses absolutely positioned dept cards; IO / bbox checks on the wrapper can read
     * “out of view” after rows grow even while the org is still on screen — that paused timers and
     * looked like a freeze right after ~6 arrivals.
     */
    if (typeof document !== "undefined") {
      if (document.visibilityState !== "hidden") startLive();
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelled = true;
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibility);
      }
      liveEnabledRef.current = false;
      clearAllBlockTimers();
      clearAllPendingPromoteTimers();
      clearAllRemoveFailsafes();
    };
  }, [reducedMotion, clearAllBlockTimers, clearAllPendingPromoteTimers, clearAllRemoveFailsafes]);

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
