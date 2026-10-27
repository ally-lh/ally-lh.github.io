"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { useAssetPreload } from "@/hooks/useAssetPreload";
import { useGame } from "@/hooks/useGame";
import { useSfx } from "@/hooks/useSfx";
import { useTouchScrollFallback } from "@/hooks/useTouchScrollFallback";
import { useViewport } from "@/hooks/useViewport";
import { isLaptopScreen } from "@/lib/game/machine";
import { isTap, type Point } from "@/lib/game/tap";
import { ACCENT, ASSETS, PIP_FRAMES } from "@/lib/theme";
import type { GalleryItem, ScreenId } from "@/lib/types";
import { Backdrop } from "./Backdrop";
import { Crosshair } from "./Crosshair";
import { DialogueBox } from "./DialogueBox";
import { Gun, type GunHandle } from "./Gun";
import { Laptop } from "./Laptop";
import { TableSurface } from "./TableSurface";
import { TargetRange } from "./TargetRange";
import { ShutterLoader } from "./ShutterLoader";
import { TiltLayer } from "./TiltLayer";
import { useShotEffects } from "./useShotEffects";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { BootScreen } from "@/components/screens/BootScreen";
import { CaseScreen } from "@/components/screens/CaseScreen";
import { ContactScreen } from "@/components/screens/ContactScreen";
import { GalleryScreen } from "@/components/screens/GalleryScreen";
import { MenuScreen } from "@/components/screens/MenuScreen";
import { ResumeScreen } from "@/components/screens/ResumeScreen";
import { TitleScreen } from "@/components/screens/TitleScreen";
import { ViewportGuard } from "@/components/screens/ViewportGuard";

function LaptopScreenContent({
  screen,
  game,
  gallery,
}: {
  screen: ScreenId;
  game: ReturnType<typeof useGame>;
  gallery?: readonly GalleryItem[];
}) {
  switch (screen) {
    case "boot":
      return <BootScreen />;
    case "menu":
      return <MenuScreen game={game} />;
    case "case":
      return <CaseScreen game={game} />;
    case "gallery":
      return <GalleryScreen game={game} items={gallery} />;
    case "about":
      return <AboutScreen game={game} />;
    case "resume":
      return <ResumeScreen game={game} />;
    case "contact":
      return <ContactScreen game={game} />;
    default:
      return null;
  }
}

/**
 * Root client component: composes the range, laptop, gun, crosshair and
 * dialogue, and routes every pointer-down (or touch tap) through the "shot"
 * pipeline.
 */
const PRELOAD_SOURCES = [...Object.values(ASSETS), ...PIP_FRAMES];

export function GameStage({
  gallery,
}: {
  /** Gallery exhibits, fetched server-side (CMS) or from static content. */
  gallery?: readonly GalleryItem[];
}) {
  // Shutter loader: preload art, then reveal the stage and start the game.
  const { progress, done } = useAssetPreload(PRELOAD_SOURCES);
  const [revealed, setRevealed] = useState(false);
  const viewport = useViewport();
  const game = useGame(revealed);
  const { pew } = useSfx();
  const stageRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const gunRef = useRef<GunHandle>(null);
  const { fire } = useShotEffects(fxRef, shakeRef);
  useTouchScrollFallback(stageRef);

  const { screen } = game.state;
  const isTitle = screen === "title";

  // Inside the laptop, touches only fire once they lift as a tap, so swiping
  // to scroll doesn't shoot (or power the laptop down). The title range has
  // nothing to scroll and its targets react on touch-down, so it fires at once.
  const pendingTouch = useRef<{ id: number; at: Point; target: Element | null } | null>(
    null,
  );

  const shoot = (to: Point, target: Element | null) => {
    if (!revealed) return;
    pew();
    if (isTitle) gunRef.current?.recoil();
    const from = gunRef.current?.muzzlePoint() ?? { x: 0, y: 0 };
    fire({ from, to, tracer: isTitle });
    // A shot that misses every interactive surface powers the laptop down.
    if (isLaptopScreen(screen) && !target?.closest("[data-shield], [data-target]")) {
      game.powerDown();
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const at = { x: e.clientX, y: e.clientY };
    const target = e.target as Element | null;
    if (e.pointerType === "touch" && !isTitle) {
      pendingTouch.current = { id: e.pointerId, at, target };
      return;
    }
    shoot(at, target);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const touch = pendingTouch.current;
    if (!touch || touch.id !== e.pointerId) return;
    pendingTouch.current = null;
    const at = { x: e.clientX, y: e.clientY };
    if (isTap(touch.at, at)) shoot(at, touch.target);
  };

  const clearPendingTouch = () => {
    pendingTouch.current = null;
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={clearPendingTouch}
      className="fixed inset-0 select-none overflow-hidden bg-bg text-ink"
      style={
        {
          "--accent": ACCENT,
          "--ui-scale": viewport.scale,
          // 1 on phone-sized landscape viewports, 0 elsewhere — multiplies
          // phone-only layout lifts (e.g. raising the laptop off the dialogue).
          "--phone-lift": viewport.phone ? 1 : 0,
          // Title screen is pure aiming, so swallow every gesture. Once the
          // laptop is open its screens scroll; iOS intersects touch-action
          // with ancestors, so "none" here would freeze those scrollers.
          touchAction: isTitle ? "none" : "pan-x pan-y",
        } as CSSProperties
      }
    >
      <div ref={shakeRef} className="absolute inset-0">
        <Backdrop />
        {isTitle && <TitleScreen />}
        <TiltLayer>
          <TargetRange active={isTitle && revealed} scale={viewport.scale} />
          <TableSurface grown={game.state.grown} />
          <Laptop
            open={!isTitle}
            grown={game.state.grown}
            wiping={game.wiping}
            onShoot={game.startBoot}
          >
            <LaptopScreenContent screen={screen} game={game} gallery={gallery} />
          </Laptop>
        </TiltLayer>
      </div>
      <DialogueBox text={game.dialogue} typing={game.dialogueTyping} />
      {/* particle overlay — useShotEffects renders into this imperatively */}
      <div ref={fxRef} className="pointer-events-none fixed inset-0 z-90" />
      <Gun active={isTitle} handleRef={gunRef} />
      <Crosshair />
      <ViewportGuard info={viewport} />
      <ShutterLoader
        progress={progress}
        done={done}
        onHidden={() => setRevealed(true)}
      />
    </div>
  );
}
