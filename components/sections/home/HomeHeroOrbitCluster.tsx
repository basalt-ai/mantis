/**
 * Hero orbit cluster — Figma v3 gesture: concentric dashed orbits, central
 * placeholder “planet”, small satellite dots + tiny pancake SVGs. Monster +
 * Notion pin are deferred (no assets yet).
 */
const ORBIT_RADII = [34, 48, 62, 76] as const;

export function HomeHeroOrbitCluster() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[min(100%,20rem)] select-none lg:max-w-[22.5rem]"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "var(--subtle-stroke)" }}
      >
        {ORBIT_RADII.map((r, i) => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r}
            stroke="currentColor"
            strokeWidth="0.65"
            strokeDasharray="3 5"
            opacity={0.28 + i * 0.07}
          />
        ))}
      </svg>

      <div
        className="absolute left-1/2 top-1/2 z-[1] size-[5.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full lg:size-[6.25rem]"
        style={{
          backgroundColor: "var(--alt-surface)",
          border: "1px dashed var(--branded-stroke-01)",
        }}
      />

      <span
        className="absolute left-[14%] top-[20%] z-[2] size-4 rounded-full lg:size-5"
        style={{ backgroundColor: "var(--palette-purple-30)" }}
      />
      <span
        className="absolute left-[72%] top-[16%] z-[2] size-3 rounded-full lg:left-[74%] lg:size-4"
        style={{ backgroundColor: "var(--palette-pink-30)" }}
      />
      <span
        className="absolute bottom-[18%] left-[22%] z-[2] size-3 rounded-full lg:bottom-[20%] lg:size-4"
        style={{ backgroundColor: "var(--palette-yellow-30)" }}
      />
      <span
        className="absolute bottom-[24%] right-[12%] z-[2] size-4 rounded-full lg:right-[10%] lg:size-5"
        style={{ backgroundColor: "var(--palette-orange-20)" }}
      />
      <span
        className="absolute right-[20%] top-[44%] z-[2] size-3 rounded-full"
        style={{ backgroundColor: "var(--palette-pink-20)" }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG decorations */}
      <img
        src="/pancake-svgs/top-2.svg"
        alt=""
        className="pointer-events-none absolute left-[78%] top-[12%] z-[2] w-8 -translate-x-1/2 -translate-y-1/2 lg:w-9"
        width={36}
        height={36}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pancake-svgs/flat-3.svg"
        alt=""
        className="pointer-events-none absolute left-[10%] top-[40%] z-[2] w-7 -translate-x-1/2 -translate-y-1/2 lg:w-8"
        width={32}
        height={32}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pancake-svgs/angled-1.svg"
        alt=""
        className="pointer-events-none absolute bottom-[16%] right-[8%] z-[2] w-8 -translate-x-1/2 -translate-y-1/2 lg:w-9"
        width={36}
        height={36}
      />
    </div>
  );
}
