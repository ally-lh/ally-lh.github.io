import type { ScreenId } from "@/lib/types";

/** PIP (the court-record AI) lines per screen. */
export const SCREEN_LINES: Readonly<Partial<Record<ScreenId, string>>> = {
  title: "This seems to be Allison's range. Maybe we can find some work here.",
  boot: "Booting portfolio OS. Stand by...",
  menu: "Oh, a menu! Let's see what we can find.",
  gallery:
    "The evidence locker. Every exhibit of graphic design work, catalogued and pinned.",
  about: "Allison's personal profile loaded. This looks interesting.",
  resume:
    "A lot of information here. Every fact checks out. Maybe we can download a copy?",
  contact: "Reached a verdict? Why not fire off a message?",
};

export const STRAY_SHOT_LINE =
  "Looks like we missed a shot. Let's try again, shall we?";
