# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (HMR)
npm run build     # production build → dist/
npm run lint      # ESLint
npm run preview   # serve the dist/ build locally
npm run deploy    # build + push to GitHub Pages (sheamunion.github.io/nuclei_visualizer)
```

No test framework is installed.

## Architecture

The entire application lives in **`src/App.jsx`** — a single file. There are no separate component files, hooks, utilities, or routing libraries. All data is hardcoded mock data in that file.

**Data model**

- `MOCK_PEOPLE` — array of individuals, each with `{ id, name, cluster, nucleus, path, activities, concentric, notes, nextStep }`. `path` is one of `"service" | "accompanying" | "participating" | "conversations"`, which determines which concentric ring they appear on in the map.
- `NUCLEI` — array of nuclei with `{ id, name, cluster, health, cycle, activities, inhabitants, x, y, ... }`. The `x/y` are SVG coordinates on the 800×520 `BASE_W × BASE_H` canvas.
- `PATH_RING_RADIUS` — maps path types to pixel radii from the nucleus center (`service: 13`, `accompanying: 30`, `participating: 52`, `conversations: 74`).

**Component tree**

```
App
├── AuthScreen          (login screen with simulated auth)
├── StarField           (fixed animated star background)
├── GraphMap            (SVG pan/zoom map — the core view)
│   ├── NucleusRing     (renders one nucleus: nebula glow, concentric ring boundaries, center dot)
│   └── GraphNode       (renders one person node on the SVG with glow halos and silhouette)
├── PersonPanel         (detail sidebar for a selected individual)
├── NucleusPanel        (detail sidebar for a selected nucleus)
├── DashboardStats      (counts by path type)
├── FilterBar           (search + cluster/path dropdowns)
├── PeopleList          (filterable roster)
└── AddPersonModal      (form to add a person to local state)
```

**GraphMap pan/zoom/inertia**

`GraphMap` manages its own SVG `viewBox` transform (`dx`, `dy`, `scale`). It handles:
- Mouse drag (desktop) — window-level listeners so drag continues outside the SVG bounds
- Pinch-to-zoom (touch) — two-finger distance ratio
- Scroll wheel zoom — zooms toward cursor position
- Momentum/inertia — `requestAnimationFrame` loop with exponential velocity decay (~380ms half-life)

The transform is stored in both React state (for re-renders) and a `ref` (for reading current scale inside velocity calculations without closure staleness). `clamp` limits pan to `dx ∈ [-500, 1000]`, `dy ∈ [-300, 700]`, scale `∈ [0.3, 9]`.

`computePersonPositions` uses `seededRandom(person.id * 73.1 + ...)` — a deterministic PRNG — so node positions are stable across renders.

**Vite base path**

`vite.config.js` sets `base: '/nuclei_visualizer/'` for GitHub Pages. Asset URLs must be relative.

## Design system

`design_system/` contains a standalone design reference (not imported by the app). Read `design_system/README.md` and `design_system/colors_and_type.css` before making visual changes.

Key rules from the design system:

- **Two visual registers:** the cosmic *Map* (dark indigo + starfield + glow effects) and the calm *chrome* (forms, panels, dashboard — lighter surfaces). The current app uses the Map register throughout.
- **Colors:** indigo (background/brand), gold (`COLORS.goldLight` — path of service), teal (`COLORS.tealLight` — accompanying), green (`COLORS.greenLight` — participating), muted blue-gray (`COLORS.textMuted` — conversations). The `COLORS` object at the top of `App.jsx` is the source of truth in the app (not the CSS variables).
- **Fonts:** Cormorant Garamond for display/serif text, Manrope for body. The app currently falls back to `system-ui` and `Georgia`.
- **Glow, not drop shadow** on the Map. Dark surfaces use `filter: url(#nodeGlow)` (SVG Gaussian blur merge) and colored radial gradients.
- **Sentence case everywhere.** No emoji in product UI; Unicode symbols (•, →, ×) are fine.
- **Terminology:** say "friend" or "individual" (not "user"), "nucleus" (not "cluster node"), "path of service" (not "role"), "accompaniment" (not "mentoring"), "core activities" (devotional gathering, study circle, children's class, junior youth group, home visit). Warm, unhurried tone — never metrics-oriented.

## Deployment

The app is deployed to `https://sheamunion.github.io/nuclei_visualizer`. Running `npm run deploy` builds and pushes `dist/` to the `gh-pages` branch via the `gh-pages` npm package. The `homepage` field in `package.json` controls the GitHub Pages URL.
