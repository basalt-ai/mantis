import { useEffect, useRef, useState } from "react";

export type Mood = "neutral" | "happy" | "upset";

interface BlinkState {
  isBlinking: boolean;
  mood: Mood;
  setMood: (mood: Mood, durationMs: number) => void;
}

export function useBlinkTimer(): BlinkState {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mood, setMoodState] = useState<Mood>("neutral");
  const moodRef = useRef<Mood>("neutral");
  const moodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setMood = (nextMood: Mood, durationMs: number) => {
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    moodRef.current = nextMood;
    setMoodState(nextMood);
    moodTimerRef.current = setTimeout(() => {
      moodRef.current = "neutral";
      setMoodState("neutral");
    }, durationMs);
  };

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = Math.random() * 5000 + 3000;
      blinkTimerRef.current = setTimeout(() => {
        if (moodRef.current === "happy") {
          moodRef.current = "neutral";
          setMoodState("neutral");
        }
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          if (moodRef.current === "neutral" && Math.random() < 0.25) {
            moodRef.current = "happy";
            setMoodState("happy");
          }
          scheduleBlink();
        }, 200);
      }, delay);
    };

    scheduleBlink();

    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    };
  }, []);

  return { isBlinking, mood, setMood };
}
