import type { Skill } from "@/lib/types";

export const BIO =
  "Since young, I loved to play indie games and create art. Since learning software development, I have been building web applications and games, and exploring the intersection of design and technology. I am currently a student at Singapore Management University, pursuing a B.Sc in Information Systems, and I am looking for opportunities to contribute my skills and creativity to meaningful projects.";

/** Optional path under /public, e.g. "/uploads/headshot.png". */
export const PROFILE_PHOTO: string | undefined = "/uploads/headshot.jpg";

export const SKILLS: readonly Skill[] = [
  { name: "LAYOUT & COMPOSITION", level: 9, pct: 90 },
  { name: "DESIGN", level: 8, pct: 85 },
  { name: "FRONT-END DEVELOPMENT", level: 7, pct: 72 },
  { name: "BACK-END DEVELOPMENT", level: 5, pct: 80 },
  { name: "SOLUTIONS ARCHITECTURE", level: 3, pct: 30 },
];

export const TOOLS: readonly string[] = [
  "VSCODE",
  "SWIFT",
  "PHOTOSHOP",
  "ILLUSTRATOR",
  "FIGMA",
  "PROCREATE",
];
