import type { SmallProject } from "@/lib/types";

/**
 * Cold cases: older school projects listed under the side quests on the
 * menu screen. Rows without an `href` open `image` (a board of screens or
 * an animated screen recording) in the lightbox. Add `year` once known.
 */
export const OLD_PROJECTS: readonly SmallProject[] = [
  {
    title: "MOODEASE",
    blurb:
      "An Android mood-tracking app: log how you feel each day, keep a journal of thoughts, follow a meditation timer and grow a collectible farm as the reward. Shown with its full screen-flow diagram.",
    year: "2023",
    tags: ["ANDROID STUDIO", "MOBILE APP", "UI/UX"],
    thumbnail: "/thumbs/moodease.webp",
    image: "/archive/moodease.webp",
  },
  {
    title: "ONLYFRIENDS",
    blurb:
      "A mobile app prototype for planning hangouts with friends: group chats with pinned events, a shared calendar and timeline, plus sign-up screens with their error states. Made for a Design & Prototyping module.",
    tags: ["UI/UX", "PROTOTYPING", "MOBILE APP"],
    thumbnail: "/thumbs/onlyfriends.webp",
    image: "/archive/onlyfriends.webp",
  },
  {
    title: "JAD BOOKSTORE",
    blurb:
      "An online bookstore built as a Java web project: browse featured titles, search and filter by category, open book details, sign up or log in, and check out a cart.",
    tags: ["JAVA", "WEB APP"],
    thumbnail: "/thumbs/jad-bookstore.webp",
    image: "/archive/jad-bookstore.webp",
  },
  {
    title: "MY FIRST WEBSITE",
    blurb:
      "My first-ever HTML/CSS project: a hand-coded personal site covering my values, interests and the careers I was considering, with a feedback form at the end.",
    tags: ["HTML", "CSS"],
    thumbnail: "/thumbs/first-website.webp",
    image: "/archive/first-website.webp",
  },
];
