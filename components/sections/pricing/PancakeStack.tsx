"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Pancake-monster stack widget — 1 to 5 pancakes, animated.
 *
 * Pancake shapes (sides + top) and master colours come from the Figma master
 * (file fr8NgOCTUxsEbrMEJA3YKu, node 177:11377). For 4 and 5 we add orange
 * and mint pancakes (mint pulled from --palette-green-10 so the brand
 * palette stays consistent), keeping the master's shape paths unchanged.
 *
 * Stacking model — BOTTOM-ANCHORED, APPEND-UPWARD.
 * The eyes-pancake (golden) sits at slot 0 at a fixed y at the BOTTOM of
 * the stack; each additional pancake is added ABOVE the previous one
 * (smaller y). Existing pancakes never change position when count changes
 * — only the newly added pancake drops in from above onto the top of the
 * stack (or, on exit, lifts off upward). That gives a real "stacking up"
 * feel: you see a new pancake arrive on top of the existing stack from
 * the sky, with the ground shadow staying put.
 *
 * Z-order: bottom pancake is rendered LAST so the new pancake landing on
 * top is drawn IN FRONT of the existing stack where they overlap.
 */

type PancakeColor = "golden" | "purple" | "orange" | "pink" | "mint";

const PANCAKE_FILL: Record<PancakeColor, { top: string; sides: string }> = {
  golden: { top: "#FFBD7A", sides: "#FFDBB5" }, // master top — has eyes (always slot 0)
  purple: { top: "#BA8BFF", sides: "#DEC3F5" }, // master middle (added at 3-stack)
  orange: { top: "#FFA45F", sides: "#FFDDBE" }, // added at 4-stack
  pink:   { top: "#FF7AA0", sides: "#FFBBC7" }, // master bottom (added at 2-stack)
  mint:   { top: "#68CEA7", sides: "#A8E5C9" }, // added at 5-stack (scaleup tier)
};

// Append-only stack: existing slot indices keep their colour and position
// when count changes; the only difference between count=N and count=N+1 is
// that the latter has one extra entry appended at the end. Slot 0 always
// has the eyes-pancake.
const STACKS: Record<1 | 2 | 3 | 4 | 5, PancakeColor[]> = {
  1: ["golden"],
  2: ["golden", "pink"],
  3: ["golden", "pink", "purple"],
  4: ["golden", "pink", "purple", "orange"],
  5: ["golden", "pink", "purple", "orange", "mint"],
};

// Alternating x offsets give the stack a playful lean. Indexed from slot 0
// (bottom of the stack) upward.
const SLOT_X = [38, 64, 24, 58, 30];
// Vertical spacing between pancake centres (master uses ~50 px).
const SLOT_DY = 48;
// Bottom-anchored: slot 0 always sits here at the BOTTOM of the stack; each
// additional slot is SLOT_DY above it. Existing slots never move when count
// changes — only the newly added (or removed) slot animates.
const BOTTOM_PANCAKE_Y = 230;
// Approximate visual height of a rendered pancake (sides svg, 212 px) plus
// the y offset of the sides svg inside the Pancake group (22.33 px).
const PANCAKE_VISUAL_HEIGHT = 234.5;
// How far below the bottom pancake the ground shadow sits.
const GROUND_OFFSET_BELOW_STACK = 12;

function slotY(slotIndex: number) {
  return BOTTOM_PANCAKE_Y - slotIndex * SLOT_DY;
}

const VIEWBOX_W = 330;
const VIEWBOX_H = 480;
const GROUND_CX = 168;
// Ground sits static below the bottom pancake (slot 0) — since that
// pancake's position no longer depends on count, the shadow can be fixed.
const GROUND_CY =
  BOTTOM_PANCAKE_Y + PANCAKE_VISUAL_HEIGHT + GROUND_OFFSET_BELOW_STACK;
// viewBox cropped so the 5-pancake stack growing upward (top mint at
// slotY(4) = 38, visual top ~60) fits with breathing, and the ground
// shadow at y≈476 fits at the bottom of the canvas.
const VIEWBOX_Y = 30;
const VIEWBOX_H_CROPPED = VIEWBOX_H - VIEWBOX_Y;

const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 13,
  mass: 0.7,
} as const;

export function PancakeStack({ count }: { count: 1 | 2 | 3 | 4 | 5 }) {
  const stack = STACKS[count];
  /* Z-order: with bottom-anchored stacking, the BOTTOM pancake (slot 0,
     golden) is drawn first so each pancake added above it overlaps in
     front. Iterate slot 0 → slot N-1 in natural order so the newest
     pancake on top renders last (= highest z). */
  return (
    <svg
      className="pancake-stack__svg"
      viewBox={`0 ${VIEWBOX_Y} ${VIEWBOX_W} ${VIEWBOX_H_CROPPED}`}
      width={VIEWBOX_W}
      height={VIEWBOX_H_CROPPED}
      role="img"
      aria-label={`stack of ${count} pancakes`}
    >
      {/* Soft ground shadow — static now, since the bottom pancake (slot 0)
          is anchored at a fixed y. */}
      <ellipse
        cx={GROUND_CX}
        cy={GROUND_CY}
        rx={132}
        ry={11}
        fill="#2C002A"
        opacity={0.09}
      />

      <AnimatePresence initial={false}>
        {stack.map((color, slotIndex) => {
          const x = SLOT_X[slotIndex];
          const y = slotY(slotIndex);
          // Eyes ride on the TOP pancake — the newest, "leading" pancake at
          // the current count. That keeps the monster's face always visible
          // at the apex of the stack and pairs with the plan-name colour
          // (which also tracks the top / newly-added pancake).
          const hasEyes = slotIndex === stack.length - 1;
          /* Existing slots keep the same target (x, y) regardless of count,
             so framer-motion skips animation on them. Only the newly
             appended (top) slot plays initial → animate (drop in from
             above) or exit (lift off upward). That's the "stack-up" feel:
             one new pancake arrives at the top of the stack, the rest
             stays put. */
          return (
            <motion.g
              key={color}
              initial={{ opacity: 0, x, y: y - 60, scale: 0.82 }}
              animate={{ opacity: 1, x, y, scale: 1 }}
              exit={{ opacity: 0, x, y: y - 40, scale: 0.78 }}
              transition={SPRING}
            >
              <Pancake color={color} hasEyes={hasEyes} />
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}

function Pancake({ color, hasEyes }: { color: PancakeColor; hasEyes: boolean }) {
  const fill = PANCAKE_FILL[color];
  return (
    <g>
      {/* Pancake sides — darker, taller rim (drawn first so the cap sits on top) */}
      <svg
        x={0.08}
        y={22.33}
        width={268}
        height={212.167}
        viewBox="0 0 118.128 94.3014"
        preserveAspectRatio="none"
      >
        <path
          d="M56.1529 0C82.716 0 118.128 22.5485 118.128 45.7613C118.128 70.8726 94.3246 94.3014 62.9668 94.3014C48.6489 94.3014 33.3911 89.8372 22.8797 83.1857C10.3699 75.2697 -0.172674 66.2245 0.00214343 49.4564C0.284939 22.3408 26.3027 0 56.1529 0Z"
          fill={fill.sides}
        />
      </svg>
      {/* Pancake top — lighter, oval cap */}
      <svg
        x={8.46}
        y={22.33}
        width={251.25}
        height={178.667}
        viewBox="0 0 110.745 79.4128"
        preserveAspectRatio="none"
      >
        <path
          d="M52.6433 0C77.5462 0 110.745 18.9885 110.745 38.5363C110.745 59.683 88.4293 79.4128 59.0314 79.4128C45.6083 79.4128 31.3042 75.6534 21.4497 70.052C9.72174 63.3858 -0.161881 55.7687 0.00200947 41.648C0.26713 18.8136 24.6588 0 52.6433 0Z"
          fill={fill.top}
        />
      </svg>
      {hasEyes ? <Eyes /> : null}
    </g>
  );
}

function Eyes() {
  // Master positions (relative to the top-pancake's 268×268 local frame):
  //   left eye  centred at (55.7, 109.5), 25.4 wide × 44.2 tall
  //   right eye centred at (135.4, 105),  33.2 wide × 57.9 tall
  // The master uses bezier paths; visually identical to plain ellipses at this
  // resolution, so we render simple ellipses for crisper edges.
  return (
    <>
      <ellipse cx={56} cy={110} rx={12.7} ry={22.1} fill="#2C002A" />
      <ellipse cx={135} cy={105} rx={16.6} ry={28.95} fill="#2C002A" />
    </>
  );
}
