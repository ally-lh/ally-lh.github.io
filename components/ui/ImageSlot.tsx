"use client";

/* eslint-disable @next/next/no-img-element -- arbitrary-size artwork in a sized frame */

import { useEffect, useRef, useState } from "react";

/**
 * Metal pin-board texture shown behind media that doesn't fill its frame
 * (letterboxed landscape shots, contained PNGs) and under placeholders.
 */
function SlotBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-panel-2"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1.3px), repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.02) 12px 24px)",
        backgroundSize: "18px 18px, auto",
      }}
    />
  );
}

/** Autoplaying video with a themed loading state until it can play. */
function VideoSlot({
  video,
  alt,
  fitClass,
  className,
}: {
  video: string;
  alt: string;
  fitClass: string;
  className: string;
}) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // If the initial autoplay attempt aborted while buffering, the video
  // stays paused once loaded — kick it explicitly when it's ready.
  const markReady = () => {
    setReady(true);
    videoRef.current?.play().catch(() => {});
  };

  // canplay can fire before hydration attaches the handler — check too.
  useEffect(() => {
    const v = videoRef.current;
    if (v && v.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      markReady();
    }
  }, []);

  return (
    <>
      <SlotBackdrop />
      <video
        ref={videoRef}
        src={video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={alt}
        onCanPlay={markReady}
        className={`absolute inset-0 h-full w-full ${fitClass} ${className} transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-panel-2">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-4 w-4 rotate-45 bg-accent"
              style={{ animation: "glow-pulse 1.2s ease-in-out infinite" }}
            />
            <div className="font-mono text-xs tracking-[3px] text-muted">
              LOADING EVIDENCE
              <span
                className="ml-1 inline-block h-3 w-[7px] bg-accent align-[-1px]"
                style={{ animation: "blink-caret 1s step-end infinite" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ImageSlotProps {
  src?: string;
  /** Video source (mp4/webm, local path or full URL). Wins over `src`;
   *  autoplays muted on a loop (muted is required for autoplay). */
  video?: string;
  alt?: string;
  placeholder: string;
  /** object-fit for the filled media. */
  fit?: "cover" | "contain";
  className?: string;
}

/**
 * Frame for user artwork. Shows a labelled placeholder until a `src` or
 * `video` (path under /public, or a full URL) is provided in the content
 * files.
 */
export function ImageSlot({
  src,
  video,
  alt = "",
  placeholder,
  fit = "cover",
  className = "",
}: ImageSlotProps) {
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  if (video) {
    return (
      <VideoSlot
        video={video}
        alt={alt}
        fitClass={fitClass}
        className={className}
      />
    );
  }
  if (src) {
    return (
      <>
        <SlotBackdrop />
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`absolute inset-0 h-full w-full ${fitClass} ${className}`}
        />
      </>
    );
  }
  return (
    <>
      <SlotBackdrop />
      <div
        className={`absolute inset-0 flex items-center justify-center ${className}`}
      >
        <div className="max-w-[80%] border border-dashed border-line-2 px-5 py-4 text-center font-mono text-xs tracking-[2px] text-muted">
          {placeholder}
        </div>
      </div>
    </>
  );
}
