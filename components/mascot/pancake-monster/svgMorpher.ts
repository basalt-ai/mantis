/**
 * SVG path morphing between the 5 monster orientations.
 * All 5 SVGs have identical path structure (same commands, same number count per path)
 * so we can linearly interpolate coordinate values based on cursor direction.
 */

import bottomRaw from "./assets/full-monster-orientations/bottom.svg?raw";
import leftRaw from "./assets/full-monster-orientations/left.svg?raw";
import middleRaw from "./assets/full-monster-orientations/middle.svg?raw";
import rightRaw from "./assets/full-monster-orientations/right.svg?raw";
import topRaw from "./assets/full-monster-orientations/top.svg?raw";

const NUM_RE = /-?[\d.]+(?:e[+-]?[\d]+)?/gi;
const PATH_RE = /\s+d="([^"]+)"/g;

function getDs(svg: string): string[] {
  return Array.from(svg.matchAll(PATH_RE), (m) => m[1]);
}

function extractNums(d: string): number[] {
  return (d.match(NUM_RE) || []).map(Number);
}

function makeTemplate(d: string): string {
  return d.replace(NUM_RE, "\x00");
}

function reconstruct(template: string, nums: number[]): string {
  let i = 0;
  return template.replace(/\x00/g, () => {
    const n = nums[i++];
    if (n === undefined) return "0";
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  });
}

const parse = (svg: string) => getDs(svg).map(extractNums);

const NUMS = {
  middle: parse(middleRaw),
  top: parse(topRaw),
  bottom: parse(bottomRaw),
  left: parse(leftRaw),
  right: parse(rightRaw),
};

export const PATH_TEMPLATES = getDs(middleRaw).map(makeTemplate);

export const PATH_META = [
  { fill: "#FFBBC7", groupOpacity: null },
  { fill: "#FF7AA0", groupOpacity: null },
  { fill: "#2C002A", groupOpacity: 0.16 },
  { fill: "#DEC3F5", groupOpacity: null },
  { fill: "#BA8BFF", groupOpacity: null },
  { fill: "#2C002A", groupOpacity: 0.16 },
  { fill: "#FFDBB5", groupOpacity: null },
  { fill: "#FFBD7A", groupOpacity: null },
  { fill: "#2C002A", groupOpacity: null },
  { fill: "#2C002A", groupOpacity: null },
] as const;

export interface Weights {
  middle: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function computeWeights(dx: number, dy: number, distance: number): Weights {
  const CENTER_DIST = 80;
  const centerWeight = Math.max(0, 1 - distance / CENTER_DIST);

  if (centerWeight >= 0.999) return { middle: 1, top: 0, bottom: 0, left: 0, right: 0 };

  const cardinal = 1 - centerWeight;
  const len = distance || 1;

  const rw = Math.max(0, dx / len) ** 2;
  const lw = Math.max(0, -dx / len) ** 2;
  const bw = Math.max(0, dy / len) ** 2;
  const tw = Math.max(0, -dy / len) ** 2;
  const sum = rw + lw + bw + tw || 1;

  return {
    middle: centerWeight,
    right: (rw / sum) * cardinal,
    left: (lw / sum) * cardinal,
    bottom: (bw / sum) * cardinal,
    top: (tw / sum) * cardinal,
  };
}

export function interpolatePaths(w: Weights): string[] {
  return PATH_TEMPLATES.map((template, p) => {
    const m = NUMS.middle[p];
    const t = NUMS.top[p];
    const b = NUMS.bottom[p];
    const l = NUMS.left[p];
    const r = NUMS.right[p];

    const len = Math.min(m.length, t.length, b.length, l.length, r.length);
    const nums = new Array(len);
    for (let i = 0; i < len; i++) {
      nums[i] = m[i] * w.middle + t[i] * w.top + b[i] * w.bottom + l[i] * w.left + r[i] * w.right;
    }
    return reconstruct(template, nums);
  });
}

export function pathCentroid(nums: number[]): { cx: number; cy: number } {
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let i = 0; i < nums.length; i += 2) {
    sumX += nums[i];
    sumY += nums[i + 1] ?? 0;
    count++;
  }
  return { cx: sumX / count, cy: sumY / count };
}

export function interpolateEyeRadii(w: Weights): [{ rx: number; ry: number }, { rx: number; ry: number }] {
  const getRadii = (p: number) => {
    const m = NUMS.middle[p],
      t = NUMS.top[p],
      b = NUMS.bottom[p],
      l = NUMS.left[p],
      r = NUMS.right[p];
    const len = Math.min(m.length, t.length, b.length, l.length, r.length);
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (let i = 0; i + 1 < len; i += 2) {
      const x = m[i] * w.middle + t[i] * w.top + b[i] * w.bottom + l[i] * w.left + r[i] * w.right;
      const y = m[i + 1] * w.middle + t[i + 1] * w.top + b[i + 1] * w.bottom + l[i + 1] * w.left + r[i + 1] * w.right;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    return { rx: (maxX - minX) / 2, ry: (maxY - minY) / 2 };
  };
  return [getRadii(8), getRadii(9)];
}

export function interpolateEyeCenters(w: Weights): [{ cx: number; cy: number }, { cx: number; cy: number }] {
  const lerp = (p: number) => {
    const m = NUMS.middle[p],
      t = NUMS.top[p],
      b = NUMS.bottom[p],
      l = NUMS.left[p],
      r = NUMS.right[p];
    const len = Math.min(m.length, t.length, b.length, l.length, r.length);
    return new Array(len).fill(0).map((_, i) => m[i] * w.middle + t[i] * w.top + b[i] * w.bottom + l[i] * w.left + r[i] * w.right);
  };
  return [pathCentroid(lerp(8)), pathCentroid(lerp(9))];
}
