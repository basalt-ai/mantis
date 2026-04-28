"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WIDTH = 480;
const HEIGHT = 640;
const GRAVITY = 0.45;
const JUMP_VELOCITY = -8;
const PIPE_WIDTH = 70;
const PIPE_GAP = 170;
const PIPE_SPEED = 2.4;
const PIPE_SPAWN_FRAMES = 95;
const BIRD_SIZE = 30;
const BIRD_X = 110;
const GROUND_HEIGHT = 70;

type Pipe = {
  x: number;
  gapY: number;
  scored: boolean;
};

type GameState = "ready" | "playing" | "over";

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [state, setState] = useState<GameState>("ready");

  const stateRef = useRef<GameState>("ready");
  const birdYRef = useRef(HEIGHT / 2);
  const birdVRef = useRef(0);
  const birdRotRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const frameRef = useRef(0);
  const scoreRef = useRef(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const stored = window.localStorage.getItem("flappy-best");
    if (stored) setBest(parseInt(stored, 10) || 0);
  }, []);

  const reset = useCallback(() => {
    birdYRef.current = HEIGHT / 2;
    birdVRef.current = 0;
    birdRotRef.current = 0;
    pipesRef.current = [];
    frameRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
  }, []);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s === "ready") {
      reset();
      setState("playing");
      birdVRef.current = JUMP_VELOCITY;
      return;
    }
    if (s === "playing") {
      birdVRef.current = JUMP_VELOCITY;
      return;
    }
    if (s === "over") {
      reset();
      setState("ready");
    }
  }, [reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawBird = (y: number, rot: number) => {
      ctx.save();
      ctx.translate(BIRD_X + BIRD_SIZE / 2, y + BIRD_SIZE / 2);
      ctx.rotate(rot);
      // body
      ctx.fillStyle = "#FFE566";
      ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      // outline
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#0a0a0a";
      ctx.strokeRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      // beak
      ctx.fillStyle = "#FF8FA3";
      ctx.fillRect(BIRD_SIZE / 2, -4, 8, 8);
      ctx.strokeRect(BIRD_SIZE / 2, -4, 8, 8);
      // eye
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(BIRD_SIZE / 2 - 10, -10, 5, 5);
      ctx.restore();
    };

    const drawPipe = (pipe: Pipe) => {
      const topH = pipe.gapY - PIPE_GAP / 2;
      const bottomY = pipe.gapY + PIPE_GAP / 2;
      const bottomH = HEIGHT - GROUND_HEIGHT - bottomY;

      ctx.fillStyle = "#7ec8ff";
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, topH);
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, bottomH);

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#0a0a0a";
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, topH);
      ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, bottomH);

      // caps
      ctx.fillStyle = "#5fb4f0";
      ctx.fillRect(pipe.x - 4, topH - 18, PIPE_WIDTH + 8, 18);
      ctx.fillRect(pipe.x - 4, bottomY, PIPE_WIDTH + 8, 18);
      ctx.strokeRect(pipe.x - 4, topH - 18, PIPE_WIDTH + 8, 18);
      ctx.strokeRect(pipe.x - 4, bottomY, PIPE_WIDTH + 8, 18);
    };

    const drawBackground = () => {
      ctx.fillStyle = "#fffef8";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // ground
      ctx.fillStyle = "#FFB347";
      ctx.fillRect(0, HEIGHT - GROUND_HEIGHT, WIDTH, GROUND_HEIGHT);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, HEIGHT - GROUND_HEIGHT, WIDTH, 3);

      // ground stripes
      const offset = (frameRef.current * PIPE_SPEED) % 30;
      ctx.fillStyle = "#e69a3a";
      for (let i = -1; i < WIDTH / 30 + 1; i++) {
        ctx.fillRect(
          i * 30 - offset,
          HEIGHT - GROUND_HEIGHT + 12,
          15,
          GROUND_HEIGHT - 12,
        );
      }
    };

    const drawScore = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.font = "bold 48px 'Space Grotesk', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(scoreRef.current), WIDTH / 2, 70);
    };

    const drawReady = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.font = "bold 28px 'Space Grotesk', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Click or press Space", WIDTH / 2, HEIGHT / 2 - 40);
      ctx.font = "16px 'DM Sans', system-ui, sans-serif";
      ctx.fillText("High score to beat: 327", WIDTH / 2, HEIGHT / 2 - 10);
    };

    const drawOver = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.55)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const boxW = 300;
      const boxH = 200;
      const boxX = (WIDTH - boxW) / 2;
      const boxY = (HEIGHT - boxH) / 2 - 20;

      ctx.fillStyle = "#fffef8";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#0a0a0a";
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      // brutalist offset shadow
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(boxX + 5, boxY + boxH, boxW, 5);
      ctx.fillRect(boxX + boxW, boxY + 5, 5, boxH);

      ctx.fillStyle = "#0a0a0a";
      ctx.textAlign = "center";
      ctx.font = "bold 28px 'Space Grotesk', system-ui, sans-serif";
      ctx.fillText("Game Over", WIDTH / 2, boxY + 50);
      ctx.font = "16px 'DM Sans', system-ui, sans-serif";
      ctx.fillText(`Score: ${scoreRef.current}`, WIDTH / 2, boxY + 90);
      ctx.fillText(`Best: ${Math.max(scoreRef.current, best)}`, WIDTH / 2, boxY + 115);
      ctx.font = "bold 16px 'Space Grotesk', system-ui, sans-serif";
      ctx.fillText("Click to retry", WIDTH / 2, boxY + 160);
    };

    const collidesWith = (pipe: Pipe, y: number) => {
      const bx = BIRD_X;
      const by = y;
      const within = bx + BIRD_SIZE > pipe.x && bx < pipe.x + PIPE_WIDTH;
      if (!within) return false;
      const topH = pipe.gapY - PIPE_GAP / 2;
      const bottomY = pipe.gapY + PIPE_GAP / 2;
      return by < topH || by + BIRD_SIZE > bottomY;
    };

    const tick = () => {
      const s = stateRef.current;

      if (s === "playing") {
        frameRef.current += 1;
        birdVRef.current += GRAVITY;
        birdYRef.current += birdVRef.current;
        birdRotRef.current = Math.max(
          -0.5,
          Math.min(1.2, birdVRef.current / 12),
        );

        if (frameRef.current % PIPE_SPAWN_FRAMES === 0) {
          const margin = 80;
          const minY = margin + PIPE_GAP / 2;
          const maxY = HEIGHT - GROUND_HEIGHT - margin - PIPE_GAP / 2;
          const gapY = Math.random() * (maxY - minY) + minY;
          pipesRef.current.push({ x: WIDTH, gapY, scored: false });
        }

        for (const pipe of pipesRef.current) {
          pipe.x -= PIPE_SPEED;
          if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.scored = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }
        }
        pipesRef.current = pipesRef.current.filter(
          (p) => p.x + PIPE_WIDTH > -10,
        );

        // collisions
        const groundY = HEIGHT - GROUND_HEIGHT - BIRD_SIZE;
        if (birdYRef.current > groundY) {
          birdYRef.current = groundY;
          endGame();
        } else if (birdYRef.current < 0) {
          birdYRef.current = 0;
          birdVRef.current = 0;
        }

        for (const pipe of pipesRef.current) {
          if (collidesWith(pipe, birdYRef.current)) {
            endGame();
            break;
          }
        }
      } else if (s === "ready") {
        // gentle hover
        birdYRef.current = HEIGHT / 2 + Math.sin(frameRef.current / 12) * 6;
        birdRotRef.current = 0;
        frameRef.current += 1;
      }

      // draw
      drawBackground();
      for (const pipe of pipesRef.current) drawPipe(pipe);
      drawBird(birdYRef.current, birdRotRef.current);

      if (s === "playing") drawScore();
      if (s === "ready") drawReady();
      if (s === "over") drawOver();

      animRef.current = requestAnimationFrame(tick);
    };

    const endGame = () => {
      if (stateRef.current !== "playing") return;
      stateRef.current = "over";
      setState("over");
      const finalScore = scoreRef.current;
      setBest((prev) => {
        const next = Math.max(prev, finalScore);
        try {
          window.localStorage.setItem("flappy-best", String(next));
        } catch {}
        return next;
      });
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [best]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-theme brut-border overflow-hidden"
        style={{ background: "#fffef8" }}
      >
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onClick={flap}
          onTouchStart={(e) => {
            e.preventDefault();
            flap();
          }}
          className="block max-w-full h-auto cursor-pointer touch-none select-none"
          style={{ width: WIDTH, maxWidth: "100%" }}
          aria-label="Flappy bird game canvas"
        />
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        Score: <span className="font-mono font-semibold">{score}</span>
        <span className="mx-2">·</span>
        Best: <span className="font-mono font-semibold">{best}</span>
        <span className="mx-2">·</span>
        High score to beat:{" "}
        <span className="font-mono font-semibold">327</span>
      </p>
    </div>
  );
}
