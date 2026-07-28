# Iconography

> Standard as of iteration 1. Audit context: [audit-1.md](audit-1.md) F2.

## The one rule

**Outlined for chrome. Filled means "selected" or "active". Nothing else.**

An icon style is information: Material 3 uses the outlined→filled transition to
mean *this is the one you're on*. Every filled icon that isn't a selected state
spends that signal on decoration.

## The set

| Surface | Family | Why |
|---|---|---|
| Flutter app (today) | **Classic Material Icons** via `Icons.*` | What Flutter ships; zero dependencies |
| Web mocks / this system | **Material Symbols Outlined**, wght 500, FILL 0 | The webfont equivalent |

These are two fonts drawing near-identical glyphs. That is acceptable for now
and dishonest to hide: earlier versions of this system claimed the app used
Material Symbols. It does not. If pixel parity between mocks and app ever
matters enough, the migration path is the `material_symbols_icons` package —
a backlog item, not a rule.

## Usage rules

1. **Chrome and metric glyphs: outlined.** `Icons.*_outlined` (or `_outline` /
   `_border` where that's the name Flutter gives it — `favorite_border`).
2. **Selected states: filled.** The nav bar's `icon:` outlined /
   `selectedIcon:` filled pairing (`app_routes.dart`) is the pattern. A toggled
   favourite may fill. Nothing else fills.
3. **Stroke-natured glyphs are exempt** — `add`, `check`, `close`,
   `chevron_*`, `arrow_*`, `play_arrow` have no meaningful filled/outlined
   distinction. Use the base name.
4. **One glyph per metric, everywhere.** Steps is the same glyph on the
   dashboard, the detail screen, settings and this system's mocks. When a
   metric's glyph is chosen, it goes in the table below — the table is the
   registry until the app centralises one.
5. **Sizes:** 24 default; 32 promo/feature cards; 40 step heroes and gate
   screens. Glyphs at 24 sit inside a ≥48dp hit area when tappable
   (`--ov-min-touch-target`).
6. **Tinting:** metric accent inside `AccentIconChip`; otherwise `onSurface` /
   `onSurfaceVariant`. Never `primary` for a metric glyph (see audit F12).
7. **No emoji.** Ever. Icons carry all visual shorthand.

## Metric glyph registry

| Metric | Glyph (Flutter name, outlined form) |
|---|---|
| Steps | `directions_walk` |
| Distance | `straighten` |
| Workout / exercise | `directions_run` |
| Heart | `favorite_border` |
| Sleep | `bed` (`_outlined`) |
| Calories | `local_fire_department` (`_outlined`) |
| Hydration | `water_drop` (`_outlined`) |
| Nutrition | `restaurant` |
| Mindfulness | `self_improvement` (stroke-natured; base OK) |
| Cycle | `calendar_month` (`_outlined`) |
| Body / weight | `monitor_weight` (`_outlined`) |
| Vitals | `monitor_heart` (`_outlined`) |

*(Registry seeded from current app usage; extend it here first, then code.)*

## Current state (measured 2026-07-28)

516 icon references in the app: 238 outlined-intent, 278 filled/base. After
subtracting nav selected-states and stroke-natured glyphs, roughly **200 uses
violate rule 1** — including `Icons.favorite` (16×) living beside
`Icons.favorite_border` (21×). Migration is mechanical and per-screen;
tracked as backlog item 1 in the audit.
