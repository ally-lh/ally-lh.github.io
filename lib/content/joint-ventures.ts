import type { SmallProject } from "@/lib/types";

/** Credited on every joint-venture row. */
const PARTNER = "ALOYSIUS LEE JING RUI";

/**
 * Co-op mode: listed under the side quests on the menu screen. Rows built
 * together carry `partner`; the partner's own solo work carries `author`.
 */
export const JOINT_VENTURES: readonly SmallProject[] = [
  {
    title: "CRAFTLY",
    blurb:
      "An e-commerce prototype for a DIY craft-kit store: a hero carousel of new arrivals with colour variants, ratings, product details and specs, plus product, contact and about pages.",
    tags: ["FIGMA", "PROTOTYPING", "UI/UX", "E-COMMERCE"],
    href: "https://www.figma.com/proto/LutGrnEKa6IlHJ34xNk9S5/Craftly?page-id=0%3A1&node-id=148-1037&starting-point-node-id=148%3A1037&t=BgeTwbJG4wkRHGFk-1",
    thumbnail: "/thumbs/craftly.webp",
    author: PARTNER,
  },
  {
    title: "POKÉMON POLAROID PHOTOBOOTH",
    blurb:
      "A free event photobooth: choose a Pokémon companion, follow the optional pose guide and take three shots that print onto a dated polaroid frame. Built for a 13\" iPad Pro.",
    year: "2026",
    tags: ["JAVASCRIPT", "CAMERA API", "PIXEL ART", "IPAD"],
    href: "https://aloy-dotting.github.io/photobooth/",
    thumbnail: "/thumbs/pokemon-photobooth.webp",
    partner: PARTNER,
  },
  {
    title: "STUDENT APP",
    blurb:
      "A mobile student app designed end to end in Figma for a final course assignment: onboarding, sign-in, profile and the app's main flows across a full set of screens.",
    tags: ["FIGMA", "MOBILE APP", "UI/UX"],
    href: "https://www.figma.com/design/XwwLif1sKp4CCxdnyCXZ16/T281-Final-CA---Student-App--?node-id=0-1&t=HA9A93L3TcdAcbnB-1",
    author: PARTNER,
  },
  {
    title: "GA PROTOTYPE",
    blurb:
      "An interactive Figma prototype made for a graded assignment in Semester 2, 2023.",
    year: "2023",
    tags: ["FIGMA", "PROTOTYPING", "UI/UX"],
    href: "https://www.figma.com/proto/s1OeYpO9TGnQeGR9ZBHpvQ/GA-Aloysius-Lee-Jing-Rui-22002151-2023-Sem-2?node-id=52-10&page-id=0%3A1&starting-point-node-id=52%3A10&t=vSecY0d8VvX7tbkF-1",
    author: PARTNER,
  },
];
