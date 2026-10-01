import type { GalleryItem } from "@/lib/types";

const PLACEHOLDER = "Awaiting evidence upload";

/**
 * Exhibits in the graphic-design evidence locker. Media lives under
 * /public/gallery; set `image` (or `video` for a looping reel) to show it.
 * `aspect` is the artwork's width / height so the tile keeps its real
 * shape. Exhibits are shown in this order unless `priority` lifts one up
 * (higher first, e.g. `priority: 1`).
 */
export const GALLERY: readonly GalleryItem[] = [
  // — SMU School of Computing —
  {
    id: "singularity-foc-banner",
    label: "THE SINGULARITY // FOC",
    category: "EVENT",
    aspect: 1800 / 1273,
    image: "/gallery/singularity-foc-banner.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "singularity-day-3",
    label: "FOC DAY 3",
    category: "EVENT",
    aspect: 1273 / 1800,
    image: "/gallery/singularity-day-3.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "socc-subcomm-recruitment",
    label: "SOCC RECRUIT",
    category: "SOCIAL",
    aspect: 1000 / 1000,
    image: "/gallery/socc-subcomm-recruitment.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "socc-subcomm-registration",
    label: "SOCC SIGN-UP",
    category: "SOCIAL",
    aspect: 1000 / 1000,
    image: "/gallery/socc-subcomm-registration.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  // — SMU Handball —
  {
    id: "handball-tryouts-cca-fair",
    label: "CCA FAIR REEL",
    category: "MOTION",
    aspect: 720 / 1280,
    video: "/gallery/handball-tryouts-cca-fair.mp4",
    imagePlaceholder: PLACEHOLDER,
    priority: 1, // lift this up to the top of the gallery
  },
  {
    id: "smuhb-handball-challenge",
    label: "HB CHALLENGE",
    category: "EVENT",
    aspect: 1080 / 1350,
    image: "/gallery/smuhb-handball-challenge.webp",
    imagePlaceholder: PLACEHOLDER,
    priority: 1, // lift this up to the top of the gallery
  },
  {
    id: "smuhb-training-dates",
    label: "TRAINING DATES",
    category: "SOCIAL",
    aspect: 1273 / 1800,
    image: "/gallery/smuhb-training-dates.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  // — SOCC + SGExams socials —
  {
    id: "sdc-results",
    label: "SDC RESULTS",
    category: "SOCIAL",
    aspect: 1181 / 1181,
    image: "/gallery/sdc-results.webp",
    imagePlaceholder: PLACEHOLDER,
    priority: 1, // lift this up to the top of the gallery
  },
  {
    id: "sgexams-educational-interest",
    label: "SGEXAMS GUIDE",
    category: "SOCIAL",
    aspect: 1800 / 1800,
    image: "/gallery/sgexams-educational-interest.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "sgexams-recruiting",
    label: "SGEXAMS HIRING",
    category: "SOCIAL",
    aspect: 1000 / 1000,
    image: "/gallery/sgexams-recruiting.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "sgexams-scholarship-article",
    label: "SGEXAMS STORY",
    category: "SOCIAL",
    aspect: 1000 / 1000,
    image: "/gallery/sgexams-scholarship-article.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  // — Project Hearts to Huts name tents —
  {
    id: "name-tent-allison",
    label: "NAME TENT // PASSPORT",
    category: "PRINT",
    aspect: 1800 / 1283,
    image: "/gallery/name-tent-allison.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "name-tent-xinlei",
    label: "NAME TENT // STICKER",
    category: "PRINT",
    aspect: 1800 / 1283,
    image: "/gallery/name-tent-xinlei.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  // — Fan event merch (@mochiidesigns) —
  {
    id: "twinz-day-event-notice",
    label: "TWINZ DAY",
    category: "EVENT",
    aspect: 1273 / 1800,
    image: "/gallery/twinz-day-event-notice.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "be-the-sun-notice",
    label: "BE THE SUN",
    category: "EVENT",
    aspect: 1273 / 1800,
    image: "/gallery/be-the-sun-notice.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "svt-photocards",
    label: "PHOTOCARD SET",
    category: "MERCH",
    aspect: 1000 / 1000,
    image: "/gallery/svt-photocards.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "jin-photocard",
    label: "PHOTOCARD",
    category: "MERCH",
    aspect: 1800 / 1800,
    image: "/gallery/jin-photocard.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "jungkook-cupsleeve",
    label: "CUPSLEEVE",
    category: "MERCH",
    aspect: 1800 / 1800,
    image: "/gallery/jungkook-cupsleeve.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "jhope-sticker",
    label: "STICKER 01",
    category: "MERCH",
    aspect: 1800 / 1800,
    image: "/gallery/jhope-sticker.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "wonyoung-sticker",
    label: "STICKER 02",
    category: "MERCH",
    aspect: 1800 / 1800,
    image: "/gallery/wonyoung-sticker.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "taehyung-banner",
    label: "BANNER",
    category: "MERCH",
    aspect: 1200 / 1200,
    image: "/gallery/taehyung-banner.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "ynwa-strip",
    label: "YNWA STRIP",
    category: "MERCH",
    aspect: 600 / 1800,
    image: "/gallery/ynwa-strip.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  // — Brand identity —
  {
    id: "yanjie-namecard",
    label: "YANJIE // NAMECARD",
    category: "BRAND",
    aspect: 1800 / 1350,
    image: "/gallery/yanjie-namecard.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "yujin-slogan",
    label: "SLOGAN",
    category: "MERCH",
    aspect: 1800 / 1800,
    image: "/gallery/yujin-slogan.webp",
    imagePlaceholder: PLACEHOLDER,
  },
  {
    id: "progress-matters-namecard",
    label: "PROGRESS MATTERS",
    category: "BRAND",
    aspect: 1280 / 959,
    image: "/gallery/progress-matters-namecard.webp",
    imagePlaceholder: PLACEHOLDER,
  },
];
