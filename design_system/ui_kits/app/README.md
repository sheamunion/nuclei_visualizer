# UI Kit — Nucleus Visualizer

The product itself, rebuilt as a click-through prototype.

## Screens

The kit covers the three screens implied by the source mock-ups (login + Map) plus the two adjacent surfaces a real product of this kind would need:

1. **Login** — exactly the mock: navy field, white card, constellation mark, green CTA.
2. **Dashboard** — a calm, cream-surface overview of the community. Stat cards + recent activity + a small map preview. (Inferred — no dashboard mock was provided. Flagged.)
3. **Map** — the core view from the mock: cosmic field, five nuclei of person-nodes connected by glowing paths, left filter panel, bottom action bar, top search.
4. **Person detail** — a side-sheet that slides over the Map when a node is clicked. Photo / initials, status, the nuclei they belong to, history of accompaniment. (Inferred. Flagged.)
5. **Add new person** — a small modal triggered by the "+ Add new person" button in the action bar. (Inferred. Flagged.)

## Components

Each component is a thin JSX file in this folder. They are intentionally minimal — they recreate the visual surface and the click-through behavior; they are not production code.

- `Logo.jsx` — the brand mark, with size + tone variants.
- `Button.jsx` — primary / secondary / ghost / on-map.
- `Input.jsx`, `TextField.jsx` — labeled inputs.
- `Card.jsx`, `GlassPanel.jsx` — the two card languages.
- `StatusChip.jsx`, `ActivityChip.jsx`.
- `TopBar.jsx`, `ActionBar.jsx`, `FilterPanel.jsx` — Map chrome.
- `GrowthMap.jsx`, `NucleusGroup.jsx`, `PersonNode.jsx`, `ConnectionLayer.jsx` — the constellation itself.
- `LoginScreen.jsx`, `DashboardScreen.jsx`, `MapScreen.jsx`, `PersonDetail.jsx`, `AddPersonModal.jsx` — full screens.

## Running

Open `index.html`. The screen toggle (top-right) cycles through Login → Dashboard → Map.

## Iconography

All icons load as `<img src="../../assets/icons/<name>.svg">` from the design system's icon set. They inherit color via filter only where strictly needed — most icons sit on neutral surfaces.
