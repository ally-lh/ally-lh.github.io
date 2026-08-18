import type { SmallProject } from "@/lib/types";

/**
 * Side quests: random small projects listed under the case grid on the
 * menu screen. Swap the placeholders for real ones; `href` is optional.
 */
export const SMALL_PROJECTS: readonly SmallProject[] = [
  {
    title: "CORDY CHROME EXTENSION",
    blurb:
      "To extract opportunity data from page to CORDY with cross CORDY API Authentication.",
    year: "2025",
    tags: ["TYPESCRIPT", "CLI", "CHROME EXTENSION", "CORDY API"],
    href: "https://github.com/ally-lh/cordy-scraping-extension",
  },
  {
    title: "(2nd) WellNest - HACKATHON",
    blurb:
      "Gamified Mobile App with Pixel Art Animating Sprites for UI, to help users track their mental health and wellness.",
    year: "2025",
    tags: ["CSS", "GSAP", "NEXTJS", "TRPC", "PRISMA", "POSTGRESQL"],
    href: "https://github.com/dotNPCs/wellnest",
  },
  {
    title: "(1st) Campus Connect - HACKATHON",
    blurb:
      "A mobile app that helps students on campus find people with the same module/event to group up with, and connect with them. Features a 'digital namecard' that can be shared with other users.",
    year: "2025",
    tags: ["NEXTJS", "TRPC", "PRISMA", "POSTGRESQL"],
    href: "https://github.com/Soda-Poppers/campus-connect",
  },
  {
    title: "SMUHB Telegram Bot",
    blurb:
      "A Telegram bot for the SMUHB community, includes an EXCEL MCP and Grok Parser to track players attendance, and answer any logistic questions.",
    year: "2026",
    tags: ["PYTHON", "TELEGRAM BOT", "GROK PARSER", "EXCEL MCP"],
    href: "https://github.com/ally-lh/smuHBLogsBot",
  },
];
