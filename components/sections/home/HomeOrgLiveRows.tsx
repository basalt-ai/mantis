"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
const COOLDOWN_MS = 3000;
const ADD_BIAS = 0.7;
const TICK_MIN_MS = 2000;
const TICK_MAX_MS = 3200;
const PENDING_TO_ACTIVE_S = 0.8;
const ADD_IN_DURATION = 0.4;
const REMOVE_SHAKE_S = 0.22;
const REMOVE_OUT_DURATION = 0.38;

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
  useEffect(() => {
    deptRowsRef.current = deptRows;
  }, [deptRows]);

  const lastTickBySurface = useRef<Record<OrgSurface, number>>({
    growth: 0,
    engineering: 0,
    operations: 0,
  });

  const liveEnabledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayedCallsRef = useRef<gsap.core.Tween[]>([]);

  const runLiveTickRef = useRef<() => void>(() => {});
  const scheduleNextTickRef = useRef<() => void>(() => {});

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const killDelayedCalls = useCallback(() => {
    delayedCallsRef.current.forEach((d) => d.kill());
    delayedCallsRef.current = [];
  }, []);

  const scheduleNextTick = useCallback(() => {
    clearTimer();
    if (!liveEnabledRef.current) return;
    const delay = TICK_MIN_MS + Math.random() * (TICK_MAX_MS - TICK_MIN_MS);
    timerRef.current = setTimeout(() => {
      runLiveTickRef.current();
      scheduleNextTickRef.current();
    }, delay);
  }, [clearTimer]);

  const runLiveTick = useCallback(() => {
    const root = scrollRootRef.current;
    if (!root || !liveEnabledRef.current) return;

    const wantsAdd = Math.random() < ADD_BIAS;
    const now = Date.now();

    const eligible = SURFACES.filter((s) => now - lastTickBySurface.current[s] >= COOLDOWN_MS);

    const canAdd = (s: OrgSurface) => {
      const rows = deptRowsRef.current[s];
      if (rows.length >= ROW_CAP) return false;
      const vis = visibleLabels(rows);
      return ROLE_POOLS[s].some((l) => !vis.has(l));
    };

    const canRemove = (s: OrgSurface) => {
      const rows = deptRowsRef.current[s];
      if (rows.length <= ROW_FLOOR) return false;
      return rows.some((r) => r.phase === "active");
    };

    let candidates = eligible.filter((s) => (wantsAdd ? canAdd(s) : canRemove(s)));
    if (candidates.length === 0) {
      candidates = eligible.filter((s) => (!wantsAdd ? canAdd(s) : canRemove(s)));
    }
    if (candidates.length === 0) {
      candidates = SURFACES.filter((s) => (wantsAdd ? canAdd(s) : canRemove(s)));
    }
    if (candidates.length === 0) return;

    const surface = candidates[Math.floor(Math.random() * candidates.length)]!;
    lastTickBySurface.current[surface] = now;

    if (wantsAdd && canAdd(surface)) {
      const rows = deptRowsRef.current[surface];
      const vis = visibleLabels(rows);
      const pool = ROLE_POOLS[surface].filter((l) => !vis.has(l));
      if (pool.length === 0) return;
      const label = pool[Math.floor(Math.random() * pool.length)]!;
      const id = makeRowId();

      const article = findDeptArticle(root, surface);
      const beforeRects = article ? captureDeptRowRects(article) : new Map<string, DOMRect>();
      const sampleRow = article?.querySelector<HTMLElement>(".home-org-diagram__row");
      const rowH = sampleRow ? Math.max(20, sampleRow.getBoundingClientRect().height) : 28;

      setDeptRows((prev) => ({
        ...prev,
        [surface]: [{ id, label, phase: "pending" }, ...prev[surface]],
      }));

      queueMicrotask(() => {
        if (!article) return;
        flipReflowRows(article, beforeRects, ADD_IN_DURATION, "power2.out");
        const el = findRowEl(root, surface, id);
        if (!el) return;
        gsap.fromTo(
          el,
          { y: -(rowH + 6), opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: ADD_IN_DURATION,
            ease: "back.out(1.18)",
            overwrite: "auto",
          },
        );
      });

      const dc = gsap.delayedCall(PENDING_TO_ACTIVE_S, () => {
        setDeptRows((prev) => ({
          ...prev,
          [surface]: prev[surface].map((r) =>
            r.id === id && r.phase === "pending" ? { ...r, phase: "active" } : r,
          ),
        }));
      });
      delayedCallsRef.current.push(dc);
      return;
    }

    if (canRemove(surface)) {
      const rows = deptRowsRef.current[surface];
      const actives = rows.filter((r) => r.phase === "active");
      if (actives.length === 0) return;
      const victim = actives[Math.floor(Math.random() * actives.length)]!;
      const article = findDeptArticle(root, surface);
      const rowEl = findRowEl(root, surface, victim.id);
      if (!article || !rowEl) return;

      const beforeRects = captureDeptRowRects(article);
      const dot = rowEl.querySelector<HTMLElement>(".home-org-diagram__dot");
      const slideX = Math.max(48, article.getBoundingClientRect().width * 0.22);

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
              flipReflowRows(article, beforeRects, 0.36, "power3.out");
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
          ease: "power3.in",
        },
        REMOVE_SHAKE_S * 0.55,
      );
    }
  }, [scrollRootRef]);

  runLiveTickRef.current = runLiveTick;
  scheduleNextTickRef.current = scheduleNextTick;

  useGSAP(
    () => {
      if (reducedMotion) return;

      let st: ScrollTrigger | null = null;
      let cancelled = false;
      let raf0 = 0;
      let raf1 = 0;

      const startLive = () => {
        liveEnabledRef.current = true;
        scheduleNextTickRef.current();
      };

      const stopLive = () => {
        liveEnabledRef.current = false;
        clearTimer();
        killDelayedCalls();
      };

      const syncLiveFromScrollPosition = () => {
        if (cancelled || !st) return;
        ScrollTrigger.refresh();
        if (st.isActive) startLive();
        else stopLive();
      };

      const attach = () => {
        const root = scrollRootRef.current;
        if (!root) return false;

        st = ScrollTrigger.create({
          trigger: root,
          start: "top 88%",
          end: "bottom 5%",
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
    { scope: scrollRootRef, dependencies: [reducedMotion, clearTimer, killDelayedCalls] },
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
