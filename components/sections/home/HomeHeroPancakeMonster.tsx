"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { PancakeMonster } from "@/components/mascot/pancake-monster/PancakeMonster";
import { HOME_HERO_MONSTER_FIGMA_PX } from "@/components/sections/home/home-hero-orbit-satellites";

/**
 * Interactive hero mascot — same slot as `/pancake-monster.png` (`--size-home-hero-monster-max-width`).
 * Size is read from the slot via `ResizeObserver` so it tracks the design token at lg+ breakpoints.
 */
export function HomeHeroPancakeMonster() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [sizePx, setSizePx] = useState(HOME_HERO_MONSTER_FIGMA_PX);

  useLayoutEffect(() => {
    const el = slotRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const apply = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setSizePx(w);
    };

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    apply();

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={slotRef} className="home-hero-pancake-monster-slot" aria-hidden>
      <PancakeMonster size={sizePx} pancakeColor="yellow" />
    </div>
  );
}
