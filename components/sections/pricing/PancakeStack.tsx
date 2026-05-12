"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Pancake-monster stack widget — 1 to 5 pancakes, animated.
 *
 * Pancake shapes (sides + top) and master colours come from the Figma master
 * (file fr8NgOCTUxsEbrMEJA3YKu, node 177:11377) — a 3-stack of pink / purple /
 * golden-with-eyes. For 4 and 5 we add orange and mint pancakes (mint pulled
 * from --palette-green-10 so the brand palette stays consistent), keeping
 * the master's shape paths unchanged.
 *
 * Z-order: bottom pancake is rendered FIRST so the eye pancake (always slot 0)
 * is drawn LAST and stays visibly on top. Each pancake's identity is keyed by
 * its colour so framer-motion smoothly shifts existing pancakes between slots
 * when the stack grows / shrinks, and only the newly-added or newly-removed
 * pancake plays the drop / fade animation.
 */

type PancakeColor = "golden" | "purple" | "orange" | "pink" | "mint";

const PANCAKE_FILL: Record<PancakeColor, { top: string; sides: string }> = {
  golden: { top: "#FFBD7A", sides: "#FFDBB5" }, // master top — has eyes (always slot 0)
  purple: { top: "#BA8BFF", sides: "#DEC3F5" }, // master middle (added at 3-stack)
  orange: { top: "#FFA45F", sides: "#FFDDBE" }, // added at 4-stack
  pink:   { top: "#FF7AA0", sides: "#FFBBC7" }, // master bottom (added at 2-stack)
  mint:   { top: "#68CEA7", sides: "#A8E5C9" }, // added at 5-stack (scaleup tier)
};

// Top-to-bottom composition. Slot 0 always has the eyes.
const STACKS: Record<1 | 2 | 3 | 4 | 5, PancakeColor[]> = {
  1: ["golden"],
  2: ["golden", "pink"],
  3: ["golden", "purple", "pink"],
  4: ["golden", "purple", "orange", "pink"],
  5: ["golden", "purple", "mint", "orange", "pink"],
};

// Alternating x offsets give the stack a playful lean (per slot from the top).
const SLOT_X = [38, 64, 24, 58, 30];
// Vertical spacing between pancake centres (master uses ~50 px).
const SLOT_DY = 48;
// Bottom-anchored: the last pancake's top edge always sits at the same y so
// the stack grows upward as the slider moves right.
const BOTTOM_PANCAKE_Y = 200;

function slotY(slotIndex: number, count: number) {
  return BOTTOM_PANCAKE_Y - (count - 1 - slotIndex) * SLOT_DY;
}

const VIEWBOX_W = 330;
const VIEWBOX_H = 480;
const GROUND_CX = 168;
const GROUND_CY = 472;
// Topmost rendered pixel of the 5-pancake stack sits around y=30 (slot 0 at
// count=5 is at slotY=8, sides svg starts at slotY+22.33). Crop the viewBox
// to start at y=20 so the 5-stack has ~10px of breathing room from the top
// edge of the SVG canvas. CSS wrap height bumped to match so pancake pixel
// size stays close to the previous 4-stack layout.
const VIEWBOX_Y = 20;
const VIEWBOX_H_CROPPED = VIEWBOX_H - VIEWBOX_Y;

export function PancakeStack({ count }: { count: 1 | 2 | 3 | 4 | 5 }) {
  const stack = STACKS[count];
  // Render slot indices in reverse so the bottom pancake is drawn first and
  // the eye pancake (slot 0) is drawn last → eyes always on top z-wise.
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
      {/* Soft ground shadow — grounds the stack regardless of size */}
      <ellipse
        cx={GROUND_CX}
        cy={GROUND_CY}
        rx={132}
        ry={11}
        fill="#2C002A"
        opacity={0.09}
      />

      <AnimatePresence initial={false}>
        {renderOrder.map((slotIndex) => {
          const color = stack[slotIndex];
          const x = SLOT_X[slotIndex];
          const y = slotY(slotIndex, count);
          const hasEyes = slotIndex === 0;
          return (
            <motion.g
              key={color}
              initial={{ opacity: 0, y: y - 90, scale: 0.82 }}
              animate={{ opacity: 1, y, scale: 1 }}
              exit={{ opacity: 0, y: y - 60, scale: 0.7 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 13,
                mass: 0.7,
              }}
              style={{ x }}
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
