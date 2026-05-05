import { useEffect, useRef, useState, type RefObject } from "react";

const FORK_THRESHOLD = 300;

interface CursorInfo {
  dx: number;
  dy: number;
  distance: number;
  isForkActive: boolean;
  cursorPos: { x: number; y: number };
}

/**
 * `getTarget` (optional): when provided, the hook uses its return value as the
 * "cursor" position (in window-relative coords) instead of the real mouse —
 * lets the monster track an arbitrary target, e.g. the nearest logo chip.
 * The function is called every animation frame.
 */
export function useCursorTracking(
  monsterRef: RefObject<HTMLElement | null>,
  getTarget?: () => { x: number; y: number } | null,
) {
  const [info, setInfo] = useState<CursorInfo>({
    dx: 0,
    dy: 0,
    distance: Infinity,
    isForkActive: false,
    cursorPos: { x: 0, y: 0 },
  });

  const rafRef = useRef<number>(0);
  const latestMouse = useRef<{ x: number; y: number } | null>(null);
  const getTargetRef = useRef(getTarget);
  getTargetRef.current = getTarget;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      latestMouse.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const overridden = getTargetRef.current?.();
      const target = overridden ?? latestMouse.current;
      if (target && monsterRef.current) {
        const rect = monsterRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const { x, y } = target;
        const dx = x - cx;
        const dy = y - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        setInfo({
          dx,
          dy,
          distance,
          isForkActive: distance < FORK_THRESHOLD,
          cursorPos: { x, y },
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [monsterRef]);

  return info;
}
