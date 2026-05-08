"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

const SLOGAN = "YOUR COFOUNDER SHOULD WORK MORE THAN YOU";
const URL_TEXT = "WWW.GETPANCAKE.AI";

export function EndcardScene() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.set(".endcard-wordmark", { opacity: 0, scale: 0.92, y: 16 });
      gsap.set(".endcard-slogan-char", { opacity: 0 });
      gsap.set(".endcard-url", { opacity: 0, y: 8 });

      const tl = gsap.timeline({ delay: 0.25 });

      tl.to(".endcard-wordmark", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.65,
        ease: "back.out(1.6)",
      })
        .to(
          ".endcard-slogan-char",
          {
            opacity: 1,
            duration: 0.02,
            stagger: 0.028,
            ease: "none",
          },
          "+=0.18",
        )
        .to(
          ".endcard-url",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.05",
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
        <Image
          src="/pancake-wordmark.png"
          alt="Pancake"
          width={739}
          height={291}
          priority
          quality={100}
          className="endcard-wordmark h-auto w-[clamp(280px,28vw,560px)] select-none"
        />
        <p
          className="endcard-slogan m-0 select-none text-center"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(13px, 1.35vw, 20px)",
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
          fontSize: "clamp(11px, 0.85vw, 14px)",
          fontWeight: 500,
          letterSpacing: "0.12em",
        }}
      >
        {URL_TEXT}
      </p>
    </main>
  );
}
