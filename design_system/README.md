# Nucleus Visualizer — Design System

A visual + interaction system for **Nucleus Visualizer**, an application for visualizing the unfoldment of the Baháʼí community: people, nuclei of activity, and the relationships of accompaniment that connect them. The interface is designed to feel less like a CRM and more like a **constellation** — each individual a point of light, each nucleus a small gathering of stars, the whole map a living picture of a community in motion.

This system encodes the visual language: a cosmic/starfield aesthetic rooted in Baháʼí teachings about light, unity, and organic growth, paired with a clean, contemporary application chrome that keeps the data legible and the actions clear.

---

## Source materials

Inputs that informed this system (the reader may not have access — listed for provenance):

- `uploads/login_screen_mockup.png` — hi-fi mock of the sign-in screen (navy background, white card, constellation-style brand mark, green primary CTA).
- `uploads/mock_up_hi_fidelity.png.png` — hi-fi mock of the primary "Nucleus Map" view (deep cosmic background, nebula/starfield, five concentric nuclei of person-nodes connected by glowing paths, left filter panel, bottom action bar).
- A written brief on **Baháʼí-inspired visual language** — covering colors (blues/greens/golds/whites), shapes (circles, lines, constellations), metaphors (light, growth, paths/journeys), typography (clean, contemporary, timeless), and motion (smooth transitions, subtle pulse/glow, flow).

No codebase or Figma was attached for this project; the system is reconstructed from the two mock-ups + the written brief, then extended with the additional surfaces (dashboard, person detail, nucleus detail, etc.) that a real product of this kind needs. Where I extrapolated, I flag it in the relevant section.

---

## What is in this folder

```
README.md                  ← you are here
SKILL.md                   ← Claude / Agent Skills entry point
colors_and_type.css        ← raw + semantic CSS variables for color, type, spacing, shadows
fonts/                     ← webfonts (Cormorant Garamond, Manrope) — loaded via @import for now
assets/
  logo-mark.svg            ← circular constellation brand mark
  logo-lockup.svg          ← mark + wordmark, horizontal
  logo-lockup-light.svg    ← light variant for dark backgrounds
  starfield-bg.svg         ← reusable cosmic background (tiles)
  icons/                   ← line-icon set (custom, matched stroke weight)
preview/                   ← Design System tab cards (colors, type, spacing, components)
ui_kits/
  app/                     ← the Nucleus Visualizer product itself
    README.md
    index.html             ← interactive click-through of the app
    *.jsx                  ← components (Logo, Button, GrowthMap, NucleusNode, FilterPanel, etc.)
```

There are **no slide templates** in this system — no deck materials were provided.

---

## CONTENT FUNDAMENTALS

Copy in Nucleus Visualizer carries a specific tone. The product touches on spiritual life, so the writing should feel **warm, sincere, and grounded** — never marketing-bro, never gamified.

**Voice**
- **Warm and unhurried.** This is not a productivity tool. Avoid urgency words ("now", "instantly", "boost").
- **Service-oriented, not metrics-oriented.** People are accompanied, not "converted". Nuclei "form" and "deepen", they do not "level up".
- **Plural-first.** "We", "our community", "the friends" sit more naturally than "you". Direct address ("you") is fine for actionable UI ("Add a person you've been accompanying"), but the broader narrative voice is collective.
- **Concrete, not abstract.** "12 friends in this nucleus" beats "12 entities in this cluster".

**Casing**
- **Sentence case everywhere** — buttons, menus, page titles, section headers. ("Add new person", not "Add New Person".)
- Proper nouns retain capitalization: "Northern Illinois Subregion", "Devotional gathering", "Junior Youth group". Treat the names of the core activities (Children's class, Junior youth group, Study circle, Devotional gathering, Home visit) as named things — sentence-case but consistent.

**Terminology**
- Use the language of the framework: **nucleus**, **community of interest**, **path of service**, **accompaniment**, **core activities**, **cycle of growth**. Never reach for corporate equivalents ("user", "lead", "funnel").
- "Friend" or "individual" — not "user". A person in the system is a **friend**.
- "Invite" is appropriate; "onboard" is not.

**Emoji**
- **No emoji in product UI.** The cosmic/light visual language carries the warmth; emoji compete with the constellation iconography and cheapen the tone.
- Unicode symbols are fine where they're typographically correct (•, →, –, ✕).

**Examples (in tone)**
- ✓ "Welcome back. The community is waiting."
- ✓ "Don't have an account? Register"
- ✓ "12 friends, 3 currently engaged in a core activity."
- ✓ "Add a person you've been accompanying."
- ✗ "🚀 Grow your community fast!"
- ✗ "You unlocked: Sustaining Activities ⭐"
- ✗ "Crush your outreach goals this quarter."

**Numbers and data**
- Spell out numbers under ten in body copy ("three children's classes"), use numerals in UI counters and tables.
- Avoid percentages unless they're truly meaningful. The framework cares about people and activities, not conversion rates.

---

## VISUAL FOUNDATIONS

The product has two visual registers that live side-by-side:

1. **The Map** — full-bleed cosmic / nebula / starfield. Dark, luminous, contemplative. This is where the data lives.
2. **The Chrome** — application surfaces (forms, dashboards, settings, login). Calm, light, and structured. Navy on cream, with the same gold + green accents.

The two registers share **one palette, one type system, one set of motifs** (circles, lines, points of light). They differ only in lightness.

### Color

- **Indigo** (`--indigo-700` `#1F3A5F` → `--indigo-950` `#0A1A35`) — the spiritual backdrop. The deep-night sky of the Map; the surface color of the brand mark; the primary text color on light backgrounds.
- **Gold** (`--gold-500` `#E5A93B`) — the station of the Manifestation, light, sustaining activity, the highest-engaged nuclei. Used sparingly and always meaningfully — never as a neutral accent.
- **Verdant green** (`--green-500` `#4FB07A`) — growth, "engaged in a core activity", primary action. The "Log in" button green.
- **Mint glow** (`--green-300` `#9BE3B8`) — luminance and motion: connections, hover states, the radiating edge of a node.
- **Cream / off-white** (`--cream-50` `#F6F1E6`) — the warmer alternative to plain white. Used as the canvas color in light surfaces; pairs with indigo more harmoniously than pure white.
- **Neutral grays** — derived from indigo (cool grays). "Not yet invited" friends, secondary text, dividers.

Reds and oranges are **avoided** as semantic colors. The framework does not have a notion of "failure", and a deep-night palette should not be punctured by alarm hues. Errors use **a muted terracotta** (`--terracotta-500` `#C26A52`) that sits inside the warm-tones family.

### Typography

- **Display / serif** — **Cormorant Garamond**, used for page titles, hero text, and the wordmark. Carries a timeless, slightly reverent quality that pairs with the cosmic theme.
- **Body / sans** — **Manrope**, a clean contemporary geometric sans with a slight humanist warmth. Used for everything else: UI, labels, data.
- **Mono** — **JetBrains Mono**, only inside the (small) developer-facing surfaces and ID badges.
- Type pairs **at scale** — display sizes are generous (40–72px); body sits at 15–16px; small UI text at 13px. Avoid mid-range "almost display" sizes (24–30px serif); they look hesitant.
- Line-heights are loose (1.5 body, 1.2 display). Letterspacing is **negative on display** (-0.01em) and **slightly open on small caps labels** (+0.06em).

> ⚠️ **Font substitution flag.** Neither font file was provided; I'm pulling Cormorant Garamond and Manrope from Google Fonts as the closest spiritually-appropriate / clean-contemporary pairing. If your brand actually uses different fonts, drop the `.woff2` files into `fonts/` and update `colors_and_type.css`.

### Spacing & layout

- **8px base grid.** All paddings, gaps, and component sizes are multiples of 4 (preferred 8). Tokens: `--space-1` 4px → `--space-12` 96px.
- **Generous breathing room on the Map.** Nodes and labels need air — never crowd a constellation.
- **Tighter chrome.** Forms and panels use 12–16px internal padding, 8–12px between fields.
- **Max content width** for forms: 440px. The login card is 520px wide × auto height, centered with 1.5× viewport vertical air above.

### Backgrounds

The signature background is the **cosmic field**: deep indigo gradient (`--indigo-950` at the edges, `--indigo-800` near center), overlaid with a faint nebula glow (radial gradient, 6% white at the brightest point) and a sparse starfield (small white dots at 20–60% opacity, randomly distributed, no parallax — these are stars, not interactive elements).

- Full-bleed on the Map.
- Subtle (15% opacity) on log-in and onboarding screens.
- **Not used** on internal admin / settings screens — those use cream surfaces.

No hand-drawn illustrations. No photography. The brand is **geometric and luminous**, not illustrative.

### Animation

- **Easing default:** `cubic-bezier(0.22, 1, 0.36, 1)` ("ease-out-quint") — slow at the end, gives the feeling of arrival.
- **Durations:** 180ms for hover/press, 260ms for panel slides, 480ms for map zoom/pan, 1200ms+ for the ambient pulse on active nuclei.
- **Pulse**: active nuclei breathe — `opacity 0.7 → 1.0`, `scale 1.0 → 1.03`, infinite, 2.4s, ease-in-out. Subtle.
- **Path flow**: connection lines have a slow gradient drift (1% per second) suggesting flow between people. Never distracting.
- **Entry**: elements fade + rise 8px on mount. No bounces. No springs.
- **No parallax.** No "shimmer". No "shake".

### Hover / press / focus

- **Hover (text/icon):** opacity 0.7 → 1.0, 180ms.
- **Hover (button, primary):** background lightens 6%; no scale change.
- **Hover (node, on Map):** outer glow grows from 8px → 16px, color matches node state.
- **Press:** scale 0.98, 100ms; background darkens 4%.
- **Focus (keyboard):** 2px gold ring with 2px offset on the focused element. Never removed.

### Borders & radii

- **Radius scale:** 4px (chip / tag), 8px (input / small button), 12px (card / panel), 24px (modal / login card), 9999px (pill, avatar, node).
- **Border width:** 1px everywhere. 1.5px stroke on icons.
- **Border color:** `rgba(255,255,255,0.08)` on dark surfaces, `rgba(31,58,95,0.12)` on light surfaces.

### Shadows / elevation

The system has **two shadow languages** in parallel:

- **Light surfaces** use a soft, slightly warm drop shadow stack (the login card):
  - `shadow-sm`: `0 1px 2px rgba(31,58,95,0.06)`
  - `shadow-md`: `0 8px 24px rgba(31,58,95,0.10), 0 2px 4px rgba(31,58,95,0.06)`
  - `shadow-lg`: `0 24px 60px rgba(31,58,95,0.18), 0 4px 12px rgba(31,58,95,0.08)`
- **Dark surfaces / the Map** use **outer glow** (light radiating outward) instead of drop shadow:
  - `glow-sm`: `0 0 12px rgba(155,227,184,0.30)` (green)
  - `glow-md`: `0 0 24px rgba(229,169,59,0.40)` (gold)
  - `glow-lg`: `0 0 48px rgba(155,227,184,0.45)` for highly-active nuclei
- Inner shadows are reserved for input fields on dark surfaces (`inset 0 1px 0 rgba(255,255,255,0.04)`).

### Transparency & blur

- The left filter panel on the Map is `rgba(20,38,68,0.55)` with `backdrop-filter: blur(16px) saturate(120%)`. This keeps the Map readable through the panel.
- The bottom action bar on the Map uses the same recipe at 50% opacity.
- **Never blur over the main content area** — the Map must stay sharp.

### Imagery

There is no photographic imagery in the core product. If photos ever enter (avatars, event covers), they are:
- Treated with a **subtle warm overlay** (`rgba(229,169,59,0.06)`),
- Cropped to circles or 12px-radius rounded rectangles,
- Never have heavy filters or grain.

### Cards

- **Light card** (`.card`): cream background, 12px radius, 1px border, `shadow-sm` rest / `shadow-md` hover, 24px internal padding. No accent borders (no "colored left edge" patterns — those feel SaaS-y and clash with the cosmic tone).
- **Dark glass card** (`.card-glass`): the filter panel pattern — indigo at 55% with blur and a 1px white-at-10% border.

### Layout rules (fixed elements)

- **Top app bar:** 64px tall, full-bleed, sits on the cosmic background on the Map and on cream elsewhere.
- **Left filter panel:** 264px wide, 16px from top app bar, 16px from left edge, vertically flexible.
- **Bottom action bar:** 72px tall, full-bleed, sits inside the Map. Contains primary-action "+" buttons centered, secondary actions right-aligned.

---

## ICONOGRAPHY

The brand uses a **custom 1.5px stroke icon set** (no fill, rounded line caps, rounded line joins, 24×24 viewBox). The set is small — the product needs maybe 24 icons total — so a CDN icon library is overkill.

I have provided a starter set in `assets/icons/` covering the essentials:
- `plus.svg`, `search.svg`, `filter.svg`, `chevron-down.svg`, `chevron-up.svg`, `chevron-right.svg`, `chevron-left.svg`
- `close.svg`, `check.svg`, `more-horizontal.svg`, `more-vertical.svg`
- `person.svg`, `people.svg`, `nucleus.svg` (concentric circles), `path.svg` (curved arrow), `sparkle.svg`, `star.svg`
- `settings.svg`, `bell.svg`, `home.svg`, `map.svg`, `chart.svg`, `info.svg`

> ⚠️ **Substitution flag.** Since no production icon set was provided, these are custom-drawn to match the stroke weight implied by the mock-ups. If you adopt **Lucide** later, the stroke weight (1.5–2px) and visual idiom (line, rounded) match closely — swapping is a one-line change. **For now, these are the canonical set.** Do not mix in other icon families.

**No emoji in product UI.** A 24×24 SVG always wins over an emoji.

**Unicode symbols** are used inline where typographically appropriate: `→` for navigation hints, `•` for separators, `–` for ranges. The `+` on action buttons is a **circle-plus icon**, not the typographic `+`, so the stroke weight matches.

**The brand mark** (`assets/logo-mark.svg`) is a small constellation: a navy disc with white + gold dots connected by thin white lines. It is iconographic itself, and pairs with the wordmark in Cormorant Garamond.

---

## Index

- **`colors_and_type.css`** — drop this into any page to get the tokens. Defines `--indigo-*`, `--gold-*`, `--green-*`, `--cream-*`, `--neutral-*`, `--terracotta-500`, plus semantic `--bg`, `--surface`, `--fg`, `--fg-muted`, `--border`, type vars `--font-display`, `--font-sans`, `--font-mono`, and the `h1`–`h6`, `body`, `small`, `mono` semantic styles.
- **`preview/`** — small HTML cards used by the Design System tab. Each one is a single concept (one palette, one type specimen, one component state cluster).
- **`assets/`** — logo files, icon set, starfield background tile.
- **`ui_kits/app/`** — the Nucleus Visualizer product itself, rebuilt as a click-through prototype.
- **`SKILL.md`** — agent skill manifest.

---

## How to iterate

This system is honest about what it is: a **first synthesis from two screens + a written brief**. Things I'd want from you to take it further:

1. **Real fonts** if the brand has them — I'm guessing with Cormorant Garamond + Manrope.
2. **A second core screen** beyond the Map — a person-detail view, a nucleus-detail view, or a dashboard — would let me lock down the "chrome" register more precisely.
3. **Voice samples** if you've written real product copy. The tone guide above is my read of the brief; your actual writing might be quieter, warmer, or more direct.
