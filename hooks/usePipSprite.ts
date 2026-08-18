"use client";

import { useEffect, useRef, useState } from "react";

/** Frame numbers are 1-based to match the sprite filenames. */
const TALK_FRAMES = [1, 2] as const;
const REST_FRAME = 2;
const BLINK_SEQUENCE = [3, 4, 3, 2] as const;

const TALK_STEP_MS = 170;
const BLINK_STEP_MS = 90;
const BLINK_MIN_DELAY_MS = 2400;
const BLINK_EXTRA_DELAY_MS = 2800;

/**
 * Drives PIP's sprite frame. While `talking`, alternates frames 1–2;
 * when idle, rests on frame 2 and periodically plays the 2→3→4→3→2 blink.
 */
export function usePipSprite(talking: boolean): number {
  const [frame, setFrame] = useState<number>(REST_FRAME);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timers = timersRef.current;
    const after = (ms: number, fn: () => void) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const clearAll = () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };

    if (talking) {
      let i = 0;
      const step = () => {
        setFrame(TALK_FRAMES[i % TALK_FRAMES.length]);
        i += 1;
        after(TALK_STEP_MS, step);
      };
      after(0, step);
      return clearAll;
    }

    after(0, () => setFrame(REST_FRAME));
    const scheduleBlink = () => {
      after(BLINK_MIN_DELAY_MS + Math.random() * BLINK_EXTRA_DELAY_MS, () => {
        BLINK_SEQUENCE.forEach((f, i) =>
          after(i * BLINK_STEP_MS, () => setFrame(f)),
        );
        scheduleBlink();
      });
    };
    scheduleBlink();
    return clearAll;
  }, [talking]);

  return frame;
}
