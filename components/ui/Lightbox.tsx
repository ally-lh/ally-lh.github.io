"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { fullResUrl, isVideoSrc } from "@/lib/media";

const MEDIA_CLASS =
  "min-h-0 max-w-full flex-1 border-2 border-line-2 object-contain";
const MEDIA_SHADOW = { boxShadow: "0 30px 80px rgba(0,0,0,0.7)" };
const MEDIA_MOTION = {
  initial: { scale: 0.94 },
  animate: { scale: 1 },
  exit: { scale: 0.96 },
  transition: { duration: 0.18 },
};

interface LightboxProps {
  /** Image or video (by file extension) to show; null hides the lightbox. */
  src: string | null;
  alt?: string;
  onClose: () => void;
}

/**
 * Fullscreen viewer for case/gallery media at full resolution. Videos
 * play with controls (muted to start); images show as-is.
 * Rendered through a portal so the laptop's 3D transforms can't trap
 * the fixed overlay. Esc or a click on the backdrop closes it; z-99
 * keeps it above the gun/dialogue but under the crosshair cursor.
 */
export function Lightbox({ src, alt = "", onClose }: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          data-shield
          className="fixed inset-0 z-99 flex flex-col items-center justify-center gap-4 p-8"
          style={{ background: "rgba(5,5,8,0.92)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          // Swallow the shot so closing doesn't fire the gun underneath.
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
        >
          {isVideoSrc(src) ? (
            <motion.video
              src={fullResUrl(src)}
              aria-label={alt}
              controls
              autoPlay
              muted
              loop
              playsInline
              className={MEDIA_CLASS}
              style={MEDIA_SHADOW}
              // Let play/seek/volume clicks through without closing.
              onClick={(e) => e.stopPropagation()}
              {...MEDIA_MOTION}
            />
          ) : (
            <motion.img
              src={fullResUrl(src)}
              alt={alt}
              draggable={false}
              className={MEDIA_CLASS}
              style={MEDIA_SHADOW}
              {...MEDIA_MOTION}
            />
          )}
          <div className="mono-label text-xs text-muted">
            &#9670; FULL-RES EXHIBIT &#8226;{" "}
            {isVideoSrc(src) ? "CLICK OUTSIDE" : "CLICK ANYWHERE"} OR ESC TO
            CLOSE
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
