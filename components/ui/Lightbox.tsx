"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { fullResUrl } from "@/lib/media";

interface LightboxProps {
  /** Image to show; null hides the lightbox. */
  src: string | null;
  alt?: string;
  onClose: () => void;
}

/**
 * Fullscreen viewer for case/gallery images at full resolution.
 * Rendered through a portal so the laptop's 3D transforms can't trap
 * the fixed overlay. Esc or any click closes it; z-99 keeps it above
 * the gun/dialogue but under the crosshair cursor.
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
          <motion.img
            src={fullResUrl(src)}
            alt={alt}
            draggable={false}
            className="min-h-0 max-w-full flex-1 border-2 border-line-2 object-contain"
            style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            transition={{ duration: 0.18 }}
          />
          <div className="mono-label text-xs text-muted">
            &#9670; FULL-RES EXHIBIT &#8226; CLICK ANYWHERE OR ESC TO CLOSE
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
