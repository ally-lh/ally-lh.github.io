# Design on Trial — Game Portfolio

An interactive, game-style portfolio built with **Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion + GSAP**, ported from the Claude Design "Game Portfolio" prototype.

You start at a shooting range. Shoot the laptop to boot `ALLISON_OS`, then browse six "case files" (projects), a suspect profile, the resume, and contact. A stray shot on any laptop screen powers the whole thing back down.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build
npm run test    # vitest (state machine, lane picker, content integrity)
npm run lint    # eslint
```

> **Note on the folder path:** this project lives under a directory whose name
> contains `:` (`CV : Work`). Colons break `PATH`-based binary lookup in npm
> scripts, so the scripts invoke binaries via `node node_modules/...` directly.
> If you ever rename the folder to something colon-free, plain `next dev` etc.
> will work again.

## Where to edit what (content vs. code)

All copy/data is separated from components — you should rarely need to touch a
component to update the portfolio:

| File | Contents |
| --- | --- |
| `lib/content/site.ts` | Name, role, email, socials, resume PDF path |
| `lib/content/cases.ts` | The six project case files (title, copy, evidence, tags, repo URL, image) |
| `lib/content/profile.ts` | Bio, profile photo, skill bars, tool inventory |
| `lib/content/resume.ts` | Experience, education, abilities |
| `lib/content/dialogue.ts` | PIP's dialogue lines per screen |
| `lib/theme.ts` | **Accent color (the red)**, asset paths, min viewport width |

To add project images: drop files under `public/` (e.g. `public/work/foo.png`)
and set `image: "/work/foo.png"` on the case in `cases.ts`. Same for
`PROFILE_PHOTO` in `profile.ts`. Put your PDF at `public/resume.pdf` for the
download button.

### The red accent

`lib/theme.ts` exports `ACCENT` (`#ff2e63`); it's injected as the `--accent`
CSS variable on the stage root, and `app/globals.css` mirrors it as the
default token. Change it in `theme.ts` (and the fallback in `globals.css`) to
re-skin the whole site — every component reads `var(--accent)`.

## Architecture

```
app/                    Next.js shell (fonts, tokens, page)
lib/
  types.ts              Shared domain types (ScreenId, CaseFile, ...)
  theme.ts              Accent color + asset registry
  content/              All copy/data (see table above)
  game/
    machine.ts          Pure reducer state machine for screens  ← unit tested
    lanes.ts            Pure lane-picking for pop-up targets    ← unit tested
hooks/
  useGame.ts            Orchestration: reducer + boot/wipe timing + dialogue
  useTypewriter.ts      Char-by-char dialogue typing
  useSfx.ts             WebAudio "pew" (no audio assets needed)
  useAssetPreload.ts    Image preloading + progress for the shutter loader
  usePipSprite.ts       PIP sprite frames (talk 1-2, idle blink 2-3-4-3-2)
  useViewport.ts        Window size → play/rotate/too-small + UI scale
components/
  ui/                   Reusable primitives (GameButton, Tag, StatBar,
                        SectionLabel, ImageSlot, AssetImage)
  game/                 Stage machinery (GameStage, Gun, Crosshair, Laptop,
                        TargetRange, TableSurface, Backdrop, DialogueBox,
                        ScreenWipe, TiltLayer, useShotEffects, art/ fallbacks)
  screens/              One component per screen (Title, Boot, Menu, Case,
                        About, Resume, Contact, TooSmallOverlay)
tests/                  Vitest suites for the pure logic + content integrity
```

Division of labor between the two animation libraries:

- **Framer Motion** — declarative UI motion: screen entrances, menu-card
  hover 3D, stat-bar fills, boot-line staggers.
- **GSAP** — imperative "game feel": crosshair/gun pointer tracking
  (`quickTo`), recoil, screen shake, bullet tracers and impact particles
  (rendered into a dedicated FX overlay so React never re-renders per shot).
- **CSS keyframes** — cheap ambient loops (scanlines, glow, caret blink).

### Screen flow

`title → (shoot laptop) → boot → menu ⇄ case/about/resume/contact`, with a
CRT wipe between laptop screens and `POWER_DOWN` back to title on a stray
shot. The transitions live in `lib/game/machine.ts` (pure, tested); all
timing lives in `hooks/useGame.ts`.

**Dev shortcut:** open any laptop screen directly with a query param, e.g.
`http://localhost:3000/?screen=menu` (`case`, `about`, `resume`, `contact`).

### Mobile & tablets

`lib/game/viewport.ts` (pure, tested) classifies the window: portrait
devices get a "rotate your device" overlay, tiny screens a refusal, and
everything else plays with a global `--ui-scale` factor (0.5–1, derived
from the viewport vs. a 1200×800 reference). The scale shrinks the gun,
the dialogue box, the closed laptop, spawned targets, and the laptop's
screen UI (via a compensated transform in `Laptop.tsx`), while
vh/vw-driven geometry adapts on its own. The dialogue box sits above the
gun (z-96 vs z-95) so PIP stays readable where they overlap. Thresholds
live in `lib/game/viewport.ts`; pinch-zoom is locked via the `viewport`
export in `app/layout.tsx`.

## Art assets

Binary art lives in `public/assets/` and is registered in `lib/theme.ts`:
`gun.png`, `table.png`, `targets.png`, `bgRange.png`, plus the dialogue
sprite frames `sprite1.png`–`sprite4.png` (36×41, PIP_FRAMES). Every asset
has a built-in SVG/CSS fallback (`components/game/art/`, `Backdrop`,
`TableSurface`, the pixel PipFace), so the site still works if a file is
missing — handy for swapping art later.

On load, `ShutterLoader` covers the stage with a roller shutter and a
"BOOTING" progress bar driven by real image preloading
(`useAssetPreload`), then rolls up and hands control to the game — the
opening dialogue and pop-up targets wait for the reveal.

## Future: 3D models

The scene is layered for a react-three-fiber upgrade:

- `Backdrop` is presentation-only — replace its contents with a `<Canvas>`
  for a 3D range without touching game logic.
- `TargetRange` / `TableSurface` / `Laptop` are isolated leaf components; any
  of them can become a 3D object while keeping the same props
  (`active`, `grown`, `open`).
- `useGame` and the reducer are renderer-agnostic — the state machine doesn't
  care whether screens are DOM or 3D.

When you get there: `npm i three @react-three/fiber @react-three/drei` and
mount the canvas inside `Backdrop`.
