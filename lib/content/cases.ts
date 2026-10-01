import type { CaseFile } from "@/lib/types";

export const CASES: readonly CaseFile[] = [
  {
    id: "cordy",
    num: "01",
    title: "CORDY",
    category: "START UP / FULL STACK",
    year: "ONGOING",
    date: "SINCE 2025.03.01",
    time: "11:11",
    demoUrl: "https://cordy.sg",
    // Video-only case, so the menu card needs its own still.
    thumbnail: "/thumbs/cordy.webp",
    video:
      "https://videos.ctfassets.net/ayry21z1dzn2/2Tmf5ypC8IJoEW4jGoa56p/a1e1558811e50ea4972154adef8c839e/Screen_Now_Recording_Aug_8_2026.mp4",
    description:
      "CORDY helps youths in Singapore work out what to do next. It knows 600+ competitions, hackathons, workshops, grants and volunteering openings, and recommends the ones that match each person's interests and goals. As co-technical lead I design and build the full-stack web app, from the Hot-or-Not shortlist feed and portfolio tracker to the APIs and database behind them, now serving 20k+ active users.",
    evidence: [
      "Recommendation System UI",
      "Portfolio Tracking System",
      "Opportunity Management System",
      "Role-based auth (NextAuth, Supabase Auth)",
      "PostgreSQL schema design with Prisma",
      "Live with 20k+ active users",
      "3rd place, SMU Hult Prize Qualifiers 2026",
    ],
    tags: [
      "FULL-STACK DEVELOPMENT",
      "UIUX",
      "NEXTJS",
      "TYPESCRIPT",
      "TRPC",
      "PRISMA",
      "POSTGRESQL",
      "TAILWINDCSS",
      "FIGMA",
    ],
    line: "Case 01. CORDY seems like a promising start-up. Examine the evidence.",
    imagePlaceholder: "Drop brand identity shots here",
  },
  {
    id: "Impact-Colliders",
    num: "02",
    title: "THE ARCHIVE",
    category: "COMMISSION / FRONT-END DEVELOPMENT",
    year: "2026",
    date: "2026.08.08",
    time: "23:15",

    demoUrl: "https://www.impactcolliders.com/thearchive/",
    image:
      "https://images.ctfassets.net/ayry21z1dzn2/5pzadYBw9lrtILRwsPRjla/5b395014e69321fef54f5265cebde21c/image.png",
    description:
      "Commissioned by Impact Colliders, this website is a digital archive of elderly's stories, designed to be accessible and easy to navigate. It features a clean layout, intuitive navigation, and responsive design for all devices.",
    evidence: [
      "FIGMA wireframes & prototypes",
      "HTML, CSS, JS front-end implementation",
      "Responsive design for accessibility",
    ],
    tags: ["FIGMA", "HTML/CSS/JS", "SEO"],
    line: "Case 02. Commissioned by Impact Colliders, this website is a digital archive of elderly's stories.",
    imagePlaceholder: "Drop zine spreads here",
  },
  {
    id: "great-eastern",
    num: "03",
    title: "MY PROTECTION EXPLORER",
    category: "WEB-APP (IPAD Ver.)",
    year: "2024",
    date: "2024.12.01",
    time: "18:30",
    demoUrl: "https://fsb-sff2024.digitalexperiencestudio.io/#/discovery",
    description:
      "A progressive-web-application using a gamified approach to allow the user to discover if their current coverage meets their desired coverage. The application uses Rive, for the animating illustrations, and have been intergrated fully with a CMS for dynamic handling of events.",
    evidence: [
      "Rive animated illustrations",
      "Showcased @ Singapore Fintech Festival 2024",
      "Intern project for Great Eastern Life",
    ],
    // Masonry board: 2 columns, each shot at its natural ratio, scrolls.
    bento: [
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/2UKttVW0ufn6OSDspXUNCK/48fb16313c28ec7fc9ce91dd3ff45bdd/Image_from_Allison_Wix_Editor__3_.jpeg",
      },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/5xsisjyCxvfy2ItcE8W7kw/9e7e235af040f6ef7dba29515b39f2e2/Image_from_Allison_Wix_Editor.jpeg",
      },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/27wsl9bD26Pu5CjYLEmF0v/eb799afa6f9a1d02ac0152fb85cabf06/Image_from_Allison_Wix_Editor__2_.jpeg",
      },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/5EKxjMWUSmFZy0pcopgeYw/0de7b03f7bfdddba71f8caba717819d4/Image_from_Allison_Wix_Editor__1_.jpeg",
      },
      { src: "/work/my-protection-explorer/expenses.webp" },
      // iPad screen recording — portrait, so the tile keeps its own ratio.
      {
        video: "/work/my-protection-explorer/walkthrough.mp4",
        aspect: "720 / 1044",
      },
    ],
    tags: ["VUE 3", "TYPESCRIPT", "Contentful CMS", "RIVE", "PWA"],
    line: "Case 03. A KPI Project for Great Eastern that was showcased at the Singapore Fintech Festival 2024.",
    imagePlaceholder: "Drop poster series here",
  },
  {
    id: "design-system",
    num: "04",
    title: "IMCS Design System",
    category: "DESIGN SYSTEM",
    year: "2023",
    date: "2023.08.09",
    time: "01:12",
    repoUrl: "https://github.com/Project-INC-2023/inc-design-system",
    description:
      "Workplace Project for IMCS, a design system that provides a consistent and cohesive user experience across all digital touchpoints. It includes a set of reusable components, guidelines, and best practices for designing and developing digital products.",
    evidence: [
      "NPM package for design system",
      "Figma library for design system",
      "UI Kit for design system",
    ],
    tags: ["NPM", "FIGMA", "DESIGN SYSTEM", "REACT", "TAILWINDCSS"],
    line: "Case 04. an FYP Project for IMCS to create a comprehensive design system that can be used across all digital touchpoints.",
    imagePlaceholder: "Drop pixel art here",
    bento: [
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/39wlxxwyYzwNdeJ1NOXXKO/06245cadc37cfff5af4541207b819672/Smart_Mockup_Templates_Kit_Cover.png?h=250",
      },
      { src: "/work/inc-design-system/data-entry.webp" },
      { src: "/work/inc-design-system/input.webp" },
      { src: "/work/inc-design-system/radio.webp" },
      { src: "/work/inc-design-system/switch.webp" },
      { src: "/work/inc-design-system/progress.webp" },
      { src: "/work/inc-design-system/spinner.webp" },
      { src: "/work/inc-design-system/tag.webp" },
      { src: "/work/inc-design-system/timepicker.webp" },
    ],
  },
  {
    id: "IMCS Toolkit",
    num: "05",
    title: "IMCS Toolkit",
    category: "FULL-STACK / FYP",
    year: "2023",
    date: "2023.09.27",
    time: "15:03",
    description:
      "A consultant's toolkit for IMCS, which includes a form builder, data visualiser, live-collaboration docs, to aide them in meeting with clients. This project was done with full agile, scrum, and kanban methodology, and was done in a team of 12.",
    evidence: ["Form builder", "Data visualiser", "Live-collaboration docs"],
    tags: ["NEXTJS", "TAILWINDCSS", "TRPC", "PRISMA", "MYSQL", "FIGMA"],
    line: "Case 05. A full-stack project for IMCS to create a consultant's toolkit as a FYP project in Y3.",
    thumbnail:
      "https://images.ctfassets.net/ayry21z1dzn2/29zpcRepRdDk1pdgd3zEEM/75dbf24b67f71ee4e8167d088bfbbc15/Score_Evaluation_Summary.png",
    imagePlaceholder: "Drop type specimens here",
    bento: [
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/9j2jSqvnWRJmFi8uvaEUD/982caeb76dc1c068a51908cc3e3d0de6/Add_Resource_EP_Consultant.png?h=250",
      },
      { src: "/work/imcs-toolkit/add-resource-template.webp" },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/6EzBf0Wtrzj3POscn7Htf0/c9c944ba79f3e64708ee7dd7e8ef776a/Personal_Note.png?h=250",
      },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/29zpcRepRdDk1pdgd3zEEM/75dbf24b67f71ee4e8167d088bfbbc15/Score_Evaluation_Summary.png?h=250",
      },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/3jhVJzltk7tB5L8yn5qVNs/2422cf2251cb29f89c69020c466a8e91/Retrieving_Resources.png?h=250",
      },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/1O9wV8YTFc5AxhKqQ89u5v/f709bcb2b9f6f71224baddac08c04ea7/Tabulated_Score_Per_Question.png?h=250",
      },
      {
        src: "https://images.ctfassets.net/ayry21z1dzn2/k7eiWY3dbCqqnJOXfY5TR/d6e1691ad92e43948a74d8eb69edc4aa/Leadership_Form_Part_2.png?h=250",
      },
    ],
  },
  {
    id: "sealed-case",
    num: "06",
    title: "SEALED CASE",
    category: "UNDER INVESTIGATION",
    year: "SOON",
    date: "PENDING",
    time: "??:??",
    comingSoon: true,
    description: "Evidence for this case is still being gathered.",
    evidence: ["Classified"],
    tags: ["COMING SOON"],
    line: "Case 06 is still sealed. Come back later.",
    imagePlaceholder: "Coming soon",
  },
];
