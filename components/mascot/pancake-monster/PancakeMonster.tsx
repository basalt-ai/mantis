"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";

import { useBlinkTimer } from "./hooks/useBlinkTimer";
import { useCursorTracking } from "./hooks/useCursorTracking";
import "./PancakeMonster.css";
import {
  computeWeights,
  interpolateEyeCenters,
  interpolateEyeRadii,
  interpolatePaths,
  PATH_META,
} from "./svgMorpher";

export type PancakeMonsterProps = {
  /** Rendered size in px (square). */
  size?: number;
  pancakeColor?: "yellow" | "purple";
  className?: string;
  style?: CSSProperties;
  onForked?: () => void;
};

const VIEWBOX = "80 150 830 800";

function UpsetOverlay({ size }: { size: number }) {
  return (
    <svg
      viewBox={VIEWBOX}
      width={size}
      height={size}
      overflow="visible"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      <path d="M386 458 C386 477 394 489 404 489 C414 489 422 477 422 458 H386 Z" fill="#2C002A" />
      <path d="M486 458 C486 480 498 497 510 497 C522 497 534 480 534 458 H486 Z" fill="#2C002A" />
      <path
        d="M375 445 C395 429 402 433 409 458"
        stroke="#E5002E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M398 400 C403 425 395 429 370 423"
        stroke="#E5002E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M425 443 C402 434 402 425 420 407"
        stroke="#E5002E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function PancakeMonster({
  size = 300,
  pancakeColor = "yellow",
  className = "",
  style,
  onForked,
}: PancakeMonsterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { dx, dy, distance, isForkActive } = useCursorTracking(wrapperRef);
  const { isBlinking, mood, setMood } = useBlinkTimer();

  const weights =
    mood === "upset"
      ? { middle: 1, top: 0, bottom: 0, left: 0, right: 0 }
      : computeWeights(dx, dy, distance);

  const paths = interpolatePaths(weights);
  const [eyeL, eyeR] = interpolateEyeCenters(weights);
  const [eyeRL, eyeRR] = interpolateEyeRadii(weights);
  const leftRx = 18.0;
  const rightRx = 24.0;

  const handleClick = () => {
    if (mood !== "upset") {
      setMood("upset", 3000);
      onForked?.();
    }
  };

  const innerClass = [
    "pancake-monster__inner",
    pancakeColor === "purple" ? "pancake-monster--purple" : "",
    mood === "upset" ? "pancake-monster--upset" : "",
    mood === "happy" ? "pancake-monster--happy" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={wrapperRef}
      className={["pancake-monster", isForkActive ? "pancake-monster--fork-active" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      onClick={handleClick}
    >
      <div className={innerClass} style={{ position: "relative", width: size, height: size }}>
        <svg
          viewBox={VIEWBOX}
          width={size}
          height={size}
          overflow="visible"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const meta = PATH_META[i];
            const fill = i === 7 && mood === "upset" ? "#FFA878" : meta.fill;
            if (meta.groupOpacity !== null) {
              return (
                <g key={i} opacity={meta.groupOpacity}>
                  <path
                    d={paths[i]}
                    fill={fill}
                    style={i === 7 ? { transition: "fill 0.4s ease" } : undefined}
                  />
                </g>
              );
            }
            return (
              <path
                key={i}
                d={paths[i]}
                fill={fill}
                style={i === 7 ? { transition: "fill 0.4s ease" } : undefined}
              />
            );
          })}

          {!isBlinking && mood === "neutral" && (
            <>
              <path d={paths[8]} fill="#2C002A" />
              <path d={paths[9]} fill="#2C002A" />
            </>
          )}

          {isBlinking && mood !== "upset" && (
            <>
              <ellipse cx={eyeL.cx} cy={eyeL.cy} rx={leftRx} ry={2.5} fill="#2C002A" />
              <ellipse cx={eyeR.cx} cy={eyeR.cy} rx={rightRx} ry={2.5} fill="#2C002A" />
            </>
          )}

          {!isBlinking && mood === "happy" && (() => {
            const lsx = (eyeRL.rx / 22) * 0.8;
            const lsy = (eyeRL.ry / 27) * 0.8;
            const rsx = (eyeRR.rx / 17) * 0.8;
            const rsy = (eyeRR.ry / 21.5) * 0.8;
            const ltx = eyeL.cx - lsx * 404;
            const lty = eyeL.cy - lsy * 465;
            const rtx = eyeR.cx - rsx * 510;
            const rty = eyeR.cy - rsy * 474.5;
            return (
              <>
                <path
                  d="M404 438 C419 438 426 456 426 476 C426 481 426 487 425 492 C418 491 411 490 404 490 C397 490 390 491 384 492 C382 487 382 482 382 476 C382 456 390 438 404 438 Z"
                  fill="#2C002A"
                  transform={`translate(${ltx.toFixed(2)},${lty.toFixed(2)}) scale(${lsx.toFixed(4)},${lsy.toFixed(4)})`}
                />
                <path
                  d="M510 453 C521 453 527 467 527 482 C527 487 527 491 526 495 C522 495 519 495 515 495 C508 495 501 495 495 496 C494 492 493 487 493 482 C493 467 499 453 510 453 Z"
                  fill="#2C002A"
                  transform={`translate(${rtx.toFixed(2)},${rty.toFixed(2)}) scale(${rsx.toFixed(4)},${rsy.toFixed(4)})`}
                />
              </>
            );
          })()}
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: mood === "upset" ? 1 : 0,
            transition: "opacity 0.15s ease",
            pointerEvents: "none",
          }}
        >
          <UpsetOverlay size={size} />
        </div>
      </div>
    </div>
  );
}
