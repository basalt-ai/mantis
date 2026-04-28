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

type LeaderboardEntry = { name: string; score: number };

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: "Cyril Codron", score: 536 },
  { name: "Guillaume Marquis", score: 327 },
  { name: "Theophile Cousin", score: 322 },
];

const LEADERBOARD_KEY = "flappy-leaderboard";
const TOP_N = 3;
const MAX_NAME_LENGTH = 20;

const sortLeaderboard = (entries: LeaderboardEntry[]) =>
  [...entries].sort((a, b) => b.score - a.score).slice(0, TOP_N);

const qualifiesForLeaderboard = (
  score: number,
  board: LeaderboardEntry[],
) => {
  if (score <= 0) return false;
  if (board.length < TOP_N) return true;
  return score > board[board.length - 1].score;
};

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [state, setState] = useState<GameState>("ready");
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(DEFAULT_LEADERBOARD);
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");

  const stateRef = useRef<GameState>("ready");
  const birdYRef = useRef(HEIGHT / 2);
  const birdVRef = useRef(0);
  const birdRotRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const frameRef = useRef(0);
  const scoreRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const leaderboardRef = useRef<LeaderboardEntry[]>(DEFAULT_LEADERBOARD);
  const pendingScoreRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    leaderboardRef.current = leaderboard;
  }, [leaderboard]);

  useEffect(() => {
    pendingScoreRef.current = pendingScore;
  }, [pendingScore]);

  useEffect(() => {
    const stored = window.localStorage.getItem("flappy-best");
    if (stored) setBest(parseInt(stored, 10) || 0);

    const storedBoard = window.localStorage.getItem(LEADERBOARD_KEY);
    if (storedBoard) {
      try {
        const parsed = JSON.parse(storedBoard);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (e: unknown): e is LeaderboardEntry =>
              !!e &&
              typeof (e as LeaderboardEntry).name === "string" &&
              typeof (e as LeaderboardEntry).score === "number",
          );
          if (valid.length > 0) setLeaderboard(sortLeaderboard(valid));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (pendingScore !== null && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [pendingScore]);

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
      if (pendingScoreRef.current !== null) return;
      reset();
      setState("ready");
    }
  }, [reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
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
      const top = leaderboardRef.current[0];
      const target = top ? `${top.name} — ${top.score}` : "—";
      ctx.fillText(`Top: ${target}`, WIDTH / 2, HEIGHT / 2 - 10);
    };

    const drawOver = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.55)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (pendingScoreRef.current !== null) return;

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
      ctx.fillText(
        `Best: ${Math.max(scoreRef.current, best)}`,
        WIDTH / 2,
        boxY + 115,
      );
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
      if (qualifiesForLeaderboard(finalScore, leaderboardRef.current)) {
        pendingScoreRef.current = finalScore;
        setPendingScore(finalScore);
        setNameInput("");
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [best]);

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingScore === null) return;
    const trimmed = nameInput.trim().slice(0, MAX_NAME_LENGTH);
    const name = trimmed || "Anonymous";
    setLeaderboard((prev) => {
      const next = sortLeaderboard([...prev, { name, score: pendingScore }]);
      try {
        window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setPendingScore(null);
    setNameInput("");
  };

  const topEntry = leaderboard[0];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-theme brut-border overflow-hidden"
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
        {pendingScore !== null && (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <form
              onSubmit={handleSubmitName}
              className="brut-border rounded-theme flex w-full max-w-[320px] flex-col gap-3 p-5"
              style={{ background: "#fffef8" }}
            >
              <h3 className="text-center font-display text-xl font-bold">
                New high score!
              </h3>
              <p className="text-center text-sm">
                You scored{" "}
                <span className="font-mono font-semibold">{pendingScore}</span>
              </p>
              <input
                ref={nameInputRef}
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                maxLength={MAX_NAME_LENGTH}
                className="brut-border rounded-theme px-3 py-2 outline-none"
                style={{ background: "#fffef8" }}
              />
              <button
                type="submit"
                className="brut-border rounded-theme px-4 py-2 font-semibold"
                style={{ background: "#FFE566" }}
              >
                Add to leaderboard
              </button>
            </form>
          </div>
        )}
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        Score: <span className="font-mono font-semibold">{score}</span>
        <span className="mx-2">·</span>
        Best: <span className="font-mono font-semibold">{best}</span>
        {topEntry && (
          <>
            <span className="mx-2">·</span>
            Top:{" "}
            <span className="font-mono font-semibold">
              {topEntry.name} ({topEntry.score})
            </span>
          </>
        )}
      </p>
      <div className="w-full max-w-[480px]">
        <h3 className="mb-2 text-center font-display text-lg font-semibold">
          Leaderboard
        </h3>
        <ol className="brut-border rounded-theme overflow-hidden">
          {leaderboard.map((entry, i) => (
            <li
              key={`${entry.name}-${i}`}
              className="flex items-center justify-between border-b border-black/10 px-4 py-2 last:border-b-0"
              style={{ background: i === 0 ? "#FFE566" : "#fffef8" }}
            >
              <span className="font-semibold">
                {i + 1}. {entry.name}
              </span>
              <span className="font-mono font-semibold">{entry.score}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
