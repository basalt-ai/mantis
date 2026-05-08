"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

import { PancakeWordmarkAnimated } from "./PancakeWordmarkAnimated";

const SLOGAN = "YOUR COFOUNDER SHOULD WORK MORE THAN YOU";
const URL_TEXT = "getpancake.ai";

export function EndcardScene() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const wordmarkEl = scope.querySelector<HTMLElement>(".endcard-wordmark");
      const wordmarkHeight = wordmarkEl?.getBoundingClientRect().height ?? 200;
      const stackGap = 24;
      const sloganLift = wordmarkHeight / 2 + stackGap / 2;

      const kMaskStroke = scope.querySelector<SVGPathElement>(
        ".endcard-k-mask-stroke",
      );
      const kPathLength = kMaskStroke?.getTotalLength() ?? 600;

      gsap.set(".endcard-k-mask-stroke", {
        strokeDasharray: kPathLength,
        strokeDashoffset: kPathLength,
      });
      gsap.set(".endcard-wordmark-rest", { opacity: 0 });
      gsap.set(".endcard-slogan", {
        y: -sloganLift,
        scale: 1.4,
        transformOrigin: "center center",
      });
      gsap.set(".endcard-slogan-char", { opacity: 0 });
      gsap.set(".endcard-url", { opacity: 0, y: 8 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(".endcard-slogan-char", {
        opacity: 1,
        duration: 0.01,
        stagger: 0.022,
        ease: "none",
      });

      tl.to(
        ".endcard-slogan",
        {
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.inOut",
        },
        "+=0.05",
      );

      tl.to(
        ".endcard-k-mask-stroke",
        {
          strokeDashoffset: 0,
          duration: 1.0,
          ease: "power2.inOut",
        },
        "+=0.25",
      );

      tl.to(
        ".endcard-wordmark-rest",
        {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
        },
        "+=0.1",
      );

      tl.to(
        ".endcard-url",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "+=0.1",
      );

      timelineRef.current = tl;
    },
    { scope: scopeRef },
  );

  const replay = () => timelineRef.current?.restart();

  return (
    <main
      ref={scopeRef}
      onClick={replay}
      className="endcard relative flex min-h-screen w-full cursor-pointer flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "var(--alt-surface)",
        color: "var(--text)",
      }}
    >
      <div
        className="endcard-stack flex flex-col items-center"
        style={{ gap: "var(--spacing-xxl)" }}
      >
        <div className="endcard-wordmark w-[clamp(280px,28vw,560px)] select-none">
          <PancakeWordmarkAnimated className="block h-auto w-full" />
        </div>
        <p
          className="endcard-slogan m-0 select-none whitespace-nowrap text-center"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(18px, 1.95vw, 38px)",
            fontWeight: 500,
            letterSpacing: "0.06em",
          }}
        >
          {SLOGAN.split("").map((char, i) => (
            <span
              key={`${char}-${i}`}
              className="endcard-slogan-char inline-block"
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </p>
      </div>

      <p
        className="endcard-url absolute bottom-[8vh] left-1/2 m-0 -translate-x-1/2 select-none"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(13px, 1vw, 18px)",
          fontWeight: 400,
          letterSpacing: 0,
        }}
      >
        {URL_TEXT}
      </p>
    </main>
  );
}
