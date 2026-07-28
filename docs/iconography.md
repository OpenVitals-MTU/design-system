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
| Steps | `directions_walk_outlined` |
| Distance | `straighten_outlined` |
| Workout / exercise | `directions_run_outlined` |
| Heart | `favorite_border` |
| Sleep | `bed_outlined` |
| Calories | `local_fire_department_outlined` |
| Hydration | `water_drop_outlined` |
| Nutrition | `restaurant_outlined` |
| Mindfulness | `self_improvement_outlined` |
| Cycle | `calendar_month_outlined` |
| Body / weight | `monitor_weight_outlined` |
| Vitals | `device_thermostat_outlined` / `monitor_heart_outlined` |

*(Registry reflects shipped usage after the 2026-07-28 migration; extend it
here first, then code.)*

## Current state (measured 2026-07-28)

**Migrated 2026-07-28.** 155 replacements across 42 files brought every
non-exempt use onto the outlined family; `favorite` joined `favorite_border`
except the two deliberate state fills (nav selection, the heart-threshold
alert, both commented in code). What remains on base names is the exemption
list above, not drift. New code follows the rules; the analyzer catches a
nonexistent `_outlined` name at the first compile.
