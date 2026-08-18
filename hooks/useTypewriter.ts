"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHAR_INTERVAL_MS = 16;

/**
 * Types text out one character at a time. Call `say(line)` to restart with a
 * new line; the previous line is cancelled.
 */
export function useTypewriter() {
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTyping(false);
  }, []);

  const say = useCallback(
    (text: string) => {
      stop();
      setTyped("");
      setTyping(text.length > 0);
      let i = 0;
      timerRef.current = setInterval(() => {
        i += 1;
        setTyped(text.slice(0, i));
        if (i >= text.length) stop();
      }, CHAR_INTERVAL_MS);
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { typed, typing, say };
}
