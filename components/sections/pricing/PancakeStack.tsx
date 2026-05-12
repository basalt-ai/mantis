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
 * Stacking model — TOP-ANCHORED, APPEND-ONLY.
 * The eyes-pancake (golden) sits at slot 0 at a fixed y; each additional
 * pancake is appended at the next slot index, which sits SLOT_DY below the
 * previous one. Existing pancakes never change slot or position when count
 * changes — only the newly added (or removed) pancake animates in or out.
 * That gives the "real stack-up feel": you see a new pancake materialise
 * at the bottom rather than a mid-stack rearrangement.
 *
 * Z-order: bottom pancake is rendered FIRST so the eyes-pancake (slot 0)
 * is drawn LAST and stays visibly on top.
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

// Alternating x offsets give the stack a playful lean (per slot from the top).
const SLOT_X = [38, 64, 24, 58, 30];
// Vertical spacing between pancake centres (master uses ~50 px).
const SLOT_DY = 48;
// Top-anchored: slot 0 always sits here; each additional slot adds SLOT_DY
// downward. Existing slots never move when count changes — only the newly
// appended (or removed) slot animates.
const TOP_PANCAKE_Y = 30;
// Approximate visual height of a rendered pancake (sides svg, 212 px) plus
// the y offset of the sides svg inside the Pancake group (22.33 px).
const PANCAKE_VISUAL_HEIGHT = 234.5;
// How far below the bottom pancake the ground shadow sits.
const GROUND_OFFSET_BELOW_STACK = 15;

function slotY(slotIndex: number) {
  return TOP_PANCAKE_Y + slotIndex * SLOT_DY;
}

function groundY(count: number) {
  return (
    TOP_PANCAKE_Y +
    (count - 1) * SLOT_DY +
    PANCAKE_VISUAL_HEIGHT +
    GROUND_OFFSET_BELOW_STACK
  );
}

const VIEWBOX_W = 330;
const VIEWBOX_H = 480;
const GROUND_CX = 168;
// viewBox cropped so the 5-pancake stack (top at y=30+0=30, bottom shadow
// at y≈480) fills the canvas tightly. The CSS wrap aspect matches this
// viewBox so the SVG renders without letterboxing.
const VIEWBOX_Y = 20;
const VIEWBOX_H_CROPPED = VIEWBOX_H - VIEWBOX_Y;

const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 13,
  mass: 0.7,
} as const;

export function PancakeStack({ count }: { count: 1 | 2 | 3 | 4 | 5 }) {
  const stack = STACKS[count];
  // Render slot indices in reverse so the bottom pancake is drawn first and
  // the eyes-pancake (slot 0) is drawn last → eyes always on top z-wise.
  const renderOrder = Array.from({ length: stack.length }, (_, i) => stack.length - 1 - i);

  return (
    <svg
      className="pancake-stack__svg"
      viewBox={`0 ${VIEWBOX_Y} ${VIEWBOX_W} ${VIEWBOX_H_CROPPED}`}
      width={VIEWBOX_W}
      height={VIEWBOX_H_CROPPED}
      role="img"
      aria-label={`stack of ${count} pancakes`}
    >
      {/* Soft ground shadow — follows the bottom of the stack on the same
          spring as the new pancake's drop-in so the foot of the stack
          stays grounded as the stack grows or shrinks. */}
      <motion.ellipse
        cx={GROUND_CX}
        initial={false}
        animate={{ cy: groundY(count) }}
        transition={SPRING}
        rx={132}
        ry={11}
        fill="#2C002A"
        opacity={0.09}
      />

      <AnimatePresence initial={false}>
        {renderOrder.map((slotIndex) => {
          const color = stack[slotIndex];
          const x = SLOT_X[slotIndex];
          const y = slotY(slotIndex);
          const hasEyes = slotIndex === 0;
          /* Existing pancakes have their slot fixed for life — so when count
             changes their target x/y don't change and framer-motion runs no
             animation on them. Only the newly appended pancake plays the
             enter (drop-in from below) or exit (fade-down) sequence. That's
             what gives the "real stack-up" feel the user asked for. */
          return (
            <motion.g
              key={color}
              initial={{ opacity: 0, x, y: y + 60, scale: 0.82 }}
              animate={{ opacity: 1, x, y, scale: 1 }}
              exit={{ opacity: 0, x, y: y + 36, scale: 0.78 }}
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
