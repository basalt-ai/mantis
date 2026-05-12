/**
 * DemoPlayer — master clock + stage + controls for the /demo film.
 *
 * The film is ~95 seconds. Every act takes a `localTime` (seconds elapsed
 * since its window started); we render at most one act per frame using a
 * single rAF-driven `time` state. AnimatePresence handles cross-act
 * transitions; intra-act animation is owned by each scene.
 *
 * Controls: play/pause (button + spacebar), restart, scrub via the chapter
 * bar. The chapter bar itself is the table of contents — clicking a chapter
 * seeks to it, and the active chapter is highlighted as the clock advances.
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Act1OOO,
  Act2Handoff,
  Act3Departure,
  Act5Return,
  Act6Close,
  Day1Monday,
  Day2Tuesday,
  Day3Wednesday,
  Day4Thursday,
  Day5Friday,
} from "./scenes";

type Chapter = {
  id: string;
  label: string;
  start: number;
  end: number;
  render: (localTime: number) => React.ReactNode;
};

const CHAPTERS: Chapter[] = [
  {
    id: "ooo",
    label: "Out of office",
    start: 0,
    end: 8,
    render: (t) => <Act1OOO localTime={t} />,
  },
  {
    id: "handoff",
    label: "The handoff",
    start: 8,
    end: 22,
    render: (t) => <Act2Handoff localTime={t} />,
  },
  {
    id: "departure",
    label: "Departure",
    start: 22,
    end: 30,
    render: (t) => <Act3Departure localTime={t} />,
  },
  {
    id: "monday",
    label: "Mon",
    start: 30,
    end: 37,
    render: (t) => <Day1Monday localTime={t} />,
  },
  {
    id: "tuesday",
    label: "Tue",
    start: 37,
    end: 48,
    render: (t) => <Day2Tuesday localTime={t} />,
  },
  {
    id: "wednesday",
    label: "Wed · voice memo",
    start: 48,
    end: 66,
    render: (t) => <Day3Wednesday localTime={t} />,
  },
  {
    id: "thursday",
    label: "Thu",
    start: 66,
    end: 73,
    render: (t) => <Day4Thursday localTime={t} />,
  },
  {
    id: "friday",
    label: "Fri",
    start: 73,
    end: 80,
    render: (t) => <Day5Friday localTime={t} />,
  },
  {
    id: "return",
    label: "Return · Yes.",
    start: 80,
    end: 90,
    render: (t) => <Act5Return localTime={t} />,
  },
  {
    id: "close",
    label: "Close",
    start: 90,
    end: 95,
    render: (t) => <Act6Close localTime={t} />,
  },
];

const TOTAL = CHAPTERS[CHAPTERS.length - 1].end;

export function DemoPlayer() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const lastFrameRef = useRef<number | null>(null);

  // Master clock — drives the whole film at wall-clock speed.
  useEffect(() => {
    if (!playing) {
      lastFrameRef.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      const last = lastFrameRef.current ?? now;
      const dt = (now - last) / 1000;
      lastFrameRef.current = now;
      setTime((t) => {
        const next = t + dt;
        if (next >= TOTAL) {
          // Hold on the last frame instead of looping silently.
          setPlaying(false);
          return TOTAL;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Spacebar toggles play/pause; R restarts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === "KeyR") {
        setTime(0);
        setPlaying(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleRestart = useCallback(() => {
    setTime(0);
    setPlaying(true);
  }, []);

  const handleSeek = useCallback((seconds: number) => {
    setTime(seconds);
    setPlaying(true);
  }, []);

  const active = CHAPTERS.find((c) => time >= c.start && time < c.end) ?? CHAPTERS[CHAPTERS.length - 1];
  const localTime = time - active.start;
  const ended = time >= TOTAL;

  return (
    <div className="demo-player">
      <header className="demo-header">
        <Link href="/" className="demo-header__brand" aria-label="Home">
          <span className="demo-header__brand-mark">Pancake</span>
        </Link>
        <div className="demo-header__title">A 95-second product film</div>
        <Link href="/signup" className="demo-header__cta" prefetch={false}>
          Start free trial
        </Link>
      </header>

      <div className="demo-stage-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="demo-stage-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
          >
            {active.render(localTime)}
          </motion.div>
        </AnimatePresence>

        {ended && (
          <button
            type="button"
            className="demo-replay"
            onClick={handleRestart}
            aria-label="Replay"
          >
            ↻ Replay
          </button>
        )}

        <div className="demo-chapter-label" aria-hidden>
          {active.label}
        </div>
      </div>

      <div className="demo-controls">
        <button
          type="button"
          className="demo-controls__btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❙❙" : "▶"}
        </button>
        <button
          type="button"
          className="demo-controls__btn"
          onClick={handleRestart}
          aria-label="Restart"
        >
          ↻
        </button>
        <div className="demo-controls__time" aria-live="off">
          {fmt(time)} / {fmt(TOTAL)}
        </div>
        <div className="demo-controls__bar">
          {CHAPTERS.map((c) => {
            const widthPct = ((c.end - c.start) / TOTAL) * 100;
            const fillPct =
              time <= c.start
                ? 0
                : time >= c.end
                  ? 100
                  : ((time - c.start) / (c.end - c.start)) * 100;
            const isActive = active.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                className={
                  isActive
                    ? "demo-controls__chapter demo-controls__chapter--active"
                    : "demo-controls__chapter"
                }
                style={{ width: `${widthPct}%` }}
                onClick={() => handleSeek(c.start)}
                aria-label={`Jump to ${c.label}`}
              >
                <span className="demo-controls__chapter-track" aria-hidden>
                  <span
                    className="demo-controls__chapter-fill"
                    style={{ width: `${fillPct}%` }}
                  />
                </span>
                <span className="demo-controls__chapter-label">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="demo-hint">
        Space to play / pause · R to restart · click a chapter to jump
      </p>
    </div>
  );
}

function fmt(s: number) {
  const total = Math.max(0, Math.round(s));
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
