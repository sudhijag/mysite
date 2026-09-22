# Handoff: Sudhi Jagadeeshi — personal site

## Overview
A single-screen personal website: name, one-line bio, six link cards (three writing pieces, three projects) and a row of icon links, over an animated dot grid on a near-black background. Everything fits in one viewport without scrolling (down to ~540px tall).

## About the design files
`site/` is a working, dependency-free implementation in plain HTML, CSS and vanilla JS (no React, no build step). Treat it as the reference for look and behaviour. It is close to production-ready; remaining work is listed under "To do". If this is moved into a framework or static-site generator, keep the markup, tokens and animation logic as-is.

## Fidelity
High-fidelity. Colours, type, spacing, radii and motion are final.

## Layout
- `main`: max-width 920px, centred, min-height 100vh, flex column, vertically centred. Padding `clamp(14px,4vh,56px) clamp(24px,6vw,72px)`. Gap between blocks `clamp(12px,3vh,36px)`. All vertical sizes use vh clamps so the page fits one screen.
- **Header** (centred column, gap `clamp(8px,1.8vh,20px)`, nudged up by `clamp(-48px,-4vh,0)`):
  - Dahlia bloom, width `clamp(60px,12vh,140px)`.
  - Name "sudhi jagadeeshi" — Courier Prime 700, `clamp(28px,5.2vh,56px)`, letter-spacing -0.015em, line-height 1.
  - Ornamental rule: 180px wide, two 1px gold lines (60% opacity) either side of a 6px gold diamond, 8px gaps.
- **Bio**: centred, max-width 600px, `clamp(13px,2.4vh,15px)`, line-height 1.6. Copy: "I write about what plants remember, what cities forget, and the small machinery of attention."
- **Cards**: CSS grid, 3 columns on wide screens (`repeat(auto-fit, minmax(max(220px, calc((100% - 56px)/3)), 1fr))`), collapsing to 2 then 1. Row gap `clamp(12px,2.6vh,24px)`, column gap 24px. Order: 3 writing, then 3 projects.
  - Card: min-height `clamp(64px,12vh,110px)`, padding `clamp(12px,2.2vh,20px) 20px`, radius 18px, 1px border `--rule`, background paper at 85% (so dots show faintly through). Content vertically centred, 6px gap.
  - Title 14px (projects bold 700). Subtitle 12.5px italic `--ink-soft`. Every card has a subtitle.
  - Hover: full border and title turn gold (`--accent`), 200ms ease.
- **Icon links**: centred row, 8px gap, pushed down (margin-top `clamp(0,5vh,56px)`, margin-bottom `clamp(-40px,-3vh,0)`). Each is a 38px circle, no border or fill at rest, 16px line icon (stroke 1.3) in `--ink-faded` at 75% opacity. Hover: gold 1px ring, gold icon, full opacity.
- **Corner bloom**: Chrysanthemum, 80px, fixed top-right (`clamp(12px,3vw,40px)` / `clamp(12px,4vh,40px)`), 50% opacity. Hidden below 1180px wide so it never overlaps content.

## Interactions & motion
- **Dot grid** (`grid.js`, full-screen fixed canvas, DPR-aware): 22px grid. Each dot's intensity `k = wave³·0.7 + drift·0.3`, where wave is a radial sine ripple from (50%, 28%) of the viewport (`sin(d·0.018 − t·1.1)`) and drift is a slow diagonal sine (`sin(x·0.006 + y·0.004 + t·0.6)`). Bone dots: alpha 0.08–0.40, radius 0.7–1.4px. ~1.2% of dots are gold (hash of grid index, stable across loads): alpha 0.45–0.95, radius 1.2–1.8px.
- **Bloom sway**: hovering either flower plays `bloomSway` — rotate −2.6° ↔ 2.6° with scale 1 ↔ 1.028, 3.4s ease-in-out, infinite, origin centre.
- `prefers-reduced-motion`: grid renders one static frame; sway disabled.

## Design tokens
- `--paper` #0d0c0a (background)
- `--ink` #ece6d4 (primary text, flowers, dots)
- `--ink-soft` #c2b9a6 (card subtitles)
- `--ink-faded` #8a8275 (icons)
- `--accent` #d4a85a (gold: rule, hover states, gold dots, selection)
- `--rule` #2e2a24 (card borders)
- Font: Courier Prime (Google Fonts), 400/700 + italics. Sizes: 56 / 15 / 14 / 12.5px (max values).
- Radii: 18px cards, full circle icon buttons.

## Assets
- Flowers are inline SVG line drawings (Dahlia, Chrysanthemum), stroke `currentColor`, generated from parametric petal rings. No raster images.
- Icons are simple inline SVGs (mail, newsletter, Are.na grid, camera).

## To do
- Replace placeholder links: all card `href="#"`, and the Newsletter / Are.na / Photographs icons. Email is a placeholder address.
- Writing subtitles are placeholder copy — confirm or replace.
- Add favicon, meta description and Open Graph tags.
- Optionally pause the canvas animation when the tab is hidden (`visibilitychange`).
- Test the one-screen fit on small phones (landscape especially); allow scrolling there if needed.

## Files
- `site/index.html` — markup, inline SVG flowers and icons
- `site/style.css` — tokens, layout, hover and sway animation
- `site/grid.js` — animated dot-grid canvas
