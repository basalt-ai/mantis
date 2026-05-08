"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

import { EndcardOrbits } from "./EndcardOrbits";
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

      gsap.set(".endcard-wordmark", {
        opacity: 0,
        scale: 0.94,
        transformOrigin: "center center",
      });
      gsap.set(".endcard-orbit-ring", { opacity: 0 });
      gsap.set(".endcard-orbit-satellite", { opacity: 0, scale: 0.85 });
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
        ".endcard-wordmark",
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
        "+=0.25",
      );

      tl.addLabel("arrival", "+=0.15");

      tl.to(
        ".endcard-url",
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        "arrival",
      );

      tl.to(
        ".endcard-orbit-ring",
        {
          opacity: 1,
          duration: 0.55,
          stagger: 0.04,
          ease: "power2.out",
        },
        "arrival",
      );

      tl.to(
        ".endcard-orbit-satellite",
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.05,
          ease: "back.out(1.6)",
        },
        "arrival",
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
        <div className="endcard-orbital-wrap relative flex w-[clamp(280px,28vw,560px)] items-center justify-center">
          <EndcardOrbits baseSize="clamp(180px, 18vw, 360px)" />
          <div className="endcard-wordmark relative z-10 w-full select-none">
            <PancakeWordmarkAnimated className="block h-auto w-full" />
          </div>
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
