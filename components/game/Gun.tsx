"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  type Ref,
} from "react";
import gsap from "gsap";
import { ASSETS } from "@/lib/theme";
import { AssetImage } from "@/components/ui/AssetImage";
import { GunArt } from "./art/GunArt";

export interface GunHandle {
  /** Muzzle flash + recoil kick. */
  recoil: () => void;
  /** Viewport position of the muzzle, used as the tracer origin. */
  muzzlePoint: () => { x: number; y: number };
}

interface GunProps {
  /** Gun is raised on the title screen and holstered elsewhere. */
  active: boolean;
  handleRef?: Ref<GunHandle>;
}

/**
 * First-person gun pinned to the bottom-right corner. Sways with the
 * pointer (GSAP quickTo) and exposes an imperative recoil for GameStage.
 */
export function Gun({ active, handleRef }: GunProps) {
  const holsterRef = useRef<HTMLDivElement>(null);
  const swayRef = useRef<HTMLDivElement>(null);
  const recoilRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = swayRef.current;
    if (!el) return;
    const rotTo = gsap.quickTo(el, "rotation", { duration: 0.25, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power2.out" });
    const move = (e: PointerEvent) => {
      const rot = gsap.utils.clamp(
        -14,
        10,
        (e.clientX / window.innerWidth - 0.72) * 22,
      );
      rotTo(rot);
      yTo((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    gsap.to(holsterRef.current, {
      y: active ? 0 : 330,
      rotation: active ? 0 : 55,
      duration: 0.55,
      ease: "power3.inOut",
    });
  }, [active]);

  useImperativeHandle(handleRef, () => ({
    recoil() {
      if (recoilRef.current) {
        gsap.fromTo(
          recoilRef.current,
          { x: 12, y: 18, rotation: 7 },
          { x: 0, y: 0, rotation: 0, duration: 0.18, ease: "power2.out" },
        );
      }
      if (flashRef.current) {
        gsap.fromTo(
          flashRef.current,
          { opacity: 1, scale: 1.5 },
          { opacity: 0, scale: 0.6, duration: 0.14, ease: "power1.out" },
        );
      }
    },
    muzzlePoint() {
      const flash = flashRef.current;
      if (!flash) {
        return { x: window.innerWidth - 150, y: window.innerHeight - 210 };
      }
      const r = flash.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
  }));

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-95"
      style={{
        // Shrinks the whole gun rig on small/short viewports (tablets, phones).
        transform: "scale(var(--ui-scale, 1))",
        transformOrigin: "100% 100%",
      }}
    >
      <div ref={holsterRef}>
      <div
        ref={swayRef}
        className="relative h-[430px] w-[560px]"
        style={{ transformOrigin: "75% 100%" }}
      >
        <div ref={recoilRef} className="absolute inset-0">
          <div
            ref={flashRef}
            className="absolute left-[56px] top-[30px] z-2 h-[76px] w-[76px] bg-accent opacity-0"
            style={{
              clipPath:
                "polygon(50% 0, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0 50%, 36% 36%)",
            }}
          />
          <AssetImage
            src={ASSETS.gun}
            className="pointer-events-none absolute bottom-[-180px] left-0 w-[560px] select-none"
            fallback={<GunArt />}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
