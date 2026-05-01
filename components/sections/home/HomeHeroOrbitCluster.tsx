/**
 * Hero orbit cluster — concentric dashed orbits + kit **Pancake stack** at center
 * (`_design-kit/USAGE.md`: under `flat-3`, middle `angled-2`, top `top-1`) with
 * small satellite dots. Orbit-positioned pancake imgs removed for now; Notion pin
 * / monster raster deferred.
 */
const ORBIT_RADII = [34, 48, 62, 76] as const;

export function HomeHeroOrbitCluster() {
  return (
    <div
      className="home-hero-orbit-cluster relative mx-auto aspect-square w-full max-w-[min(100%,20rem)] select-none lg:max-w-[22.5rem]"
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

      {/* Canonical stack: USAGE.md — brand / alt-1 / alt-2 map to SVG fills in `/pancake-svgs/`. */}
      <div className="pancake-stack">
        <div className="pancake" data-color="brand" data-stack-pos="under">
          {/* eslint-disable-next-line @next/next/no-img-element -- local kit SVG */}
          <img src="/pancake-svgs/flat-3.svg" alt="" />
        </div>
        <div className="pancake" data-color="alt-1" data-stack-pos="middle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pancake-svgs/angled-2.svg" alt="" />
        </div>
        <div className="pancake" data-color="alt-2" data-stack-pos="top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pancake-svgs/top-1.svg" alt="" />
        </div>
      </div>

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
    </div>
  );
}
