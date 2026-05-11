"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Pancake stack widget — 2 to 5 pancakes, animated.
 *
 * Paths are inlined verbatim from the Figma master (file fr8NgOCTUxsEbrMEJA3YKu,
 * node 177:11377). The master is a 3-stack with golden top + purple middle +
 * pink bottom; for 4 and 5 we add orange and mint pancakes from the same brand
 * palette and reuse the master's pancake shapes (just recolored).
 *
 * Composition (top → bottom): the eye pancake is always slot 0. New pancakes
 * appear BETWEEN the eyes and the next existing pancake, so each color keeps
 * a stable identity across stack sizes (framer-motion uses the color as the
 * key, so adding a new color triggers a single drop-in animation while the
 * others smoothly shift to their new slot).
 */

type PancakeColor = "golden" | "purple" | "orange" | "mint" | "pink";

const PANCAKE_FILL: Record<PancakeColor, { top: string; sides: string }> = {
  golden: { top: "#FFBD7A", sides: "#FFDBB5" }, // master top — has eyes
  purple: { top: "#BA8BFF", sides: "#DEC3F5" }, // master middle
  orange: { top: "#FFA45F", sides: "#FFDDBE" }, // added at 4-stack
  mint:   { top: "#68CEA7", sides: "#A6E2C8" }, // added at 5-stack
  pink:   { top: "#FF7AA0", sides: "#FFBBC7" }, // master bottom
};

const STACKS: Record<2 | 3 | 4 | 5, PancakeColor[]> = {
  2: ["golden", "pink"],
  3: ["golden", "purple", "pink"],
  4: ["golden", "purple", "orange", "pink"],
  5: ["golden", "purple", "orange", "mint", "pink"],
};

// Alternating x offsets (per slot from the top) to give the stack a playful lean.
const SLOT_X = [38, 67, 26, 70, 30];
// Vertical spacing between pancake centres.
const SLOT_DY = 50;
// Bottom-anchored: the last pancake always sits at the same y so the stack
// "grows up" as the slider moves right.
const BOTTOM_PANCAKE_Y = 204;

function slotY(slotIndex: number, count: number) {
  return BOTTOM_PANCAKE_Y - (count - 1 - slotIndex) * SLOT_DY;
}

// SVG viewBox sized to fit the tallest stack (5 pancakes) without clipping.
const VIEWBOX_W = 335;
const VIEWBOX_H = 472;

export function PancakeStack({ count }: { count: 2 | 3 | 4 | 5 }) {
  const stack = STACKS[count];
  return (
    <svg
      className="pancake-stack__svg"
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      width={VIEWBOX_W}
      height={VIEWBOX_H}
      role="img"
      aria-label={`stack of ${count} pancakes`}
    >
      <AnimatePresence initial={false}>
        {stack.map((color, slotIndex) => {
          const x = SLOT_X[slotIndex];
          const y = slotY(slotIndex, count);
          const hasEyes = slotIndex === 0;
          return (
            <motion.g
              key={color}
              initial={{ opacity: 0, y: y - 80, scale: 0.85 }}
              animate={{ opacity: 1, y, scale: 1 }}
              exit={{ opacity: 0, y: y + 40, scale: 0.7 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 14,
                mass: 0.8,
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
      {/* Pancake sides (darker, taller rim) */}
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
      {/* Pancake top (lighter, oval cap) */}
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
  // Positions are master-frame coords relative to the top pancake's local origin.
  // Left eye: master (81, 91.43) − pancake origin (38, 4) = (43, 87.43)
  // Right eye: master (156.75, 80) − pancake origin (38, 4) = (118.75, 76)
  // Both rotated 90° to render as vertical ovals (master uses rotated bounding box).
  return (
    <>
      <g transform="translate(43 87.43) rotate(90) translate(0 -25.396)">
        <svg
          width={44.227}
          height={25.396}
          viewBox="0 0 19.6564 11.2871"
          preserveAspectRatio="none"
        >
          <path
            d="M9.82821 0C14.9963 0 19.6564 1.9347 19.6564 5.62442C19.6564 9.32941 15.0479 11.2871 9.82821 11.2871C4.6085 11.2871 0 9.32941 0 5.62442C0 1.9347 4.66017 0 9.82821 0Z"
            fill="#2C002A"
          />
        </svg>
      </g>
      <g transform="translate(118.75 76) rotate(90) translate(0 -33.247)">
        <svg
          width={57.899}
          height={33.247}
          viewBox="0 0 25.7328 14.7763"
          preserveAspectRatio="none"
        >
          <path
            d="M12.8664 0C19.632 0 25.7328 2.53277 25.7328 7.36308C25.7328 12.2134 19.6997 14.7763 12.8664 14.7763C6.03311 14.7763 0 12.2134 0 7.36308C0 2.53277 6.10076 0 12.8664 0Z"
            fill="#2C002A"
          />
        </svg>
      </g>
    </>
  );
}
