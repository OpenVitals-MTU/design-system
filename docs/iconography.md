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
| Android app (today) | **Material Icons** via Compose's `Icons.Outlined.*` (`material-icons-extended`) | What Compose ships; already a dependency |
| Web mocks / this system | **Material Symbols Outlined**, wght 500, FILL 0 | The webfont equivalent |

These are two fonts drawing near-identical glyphs. That is acceptable for now
and dishonest to hide: earlier versions of this system claimed the app used
Material Symbols. It does not. If pixel parity between mocks and app ever
matters enough, the migration path is a Material Symbols font asset — a backlog
item, not a rule.

## Usage rules

1. **Chrome and metric glyphs: outlined.** `Icons.Outlined.*`, or
   `Icons.AutoMirrored.Outlined.*` for glyphs that must flip in RTL
   (`DirectionsWalk`, `DirectionsRun`, `ArrowBack`, list glyphs). Never
   `Icons.Filled.*` or its alias `Icons.Default.*`.
2. **Selected states: filled.** A navigation item's unselected/selected pairing
   is the pattern. A toggled favourite may fill. Nothing else fills.
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

| Metric | Compose glyph | Webfont name |
|---|---|---|
| Steps | `Icons.AutoMirrored.Outlined.DirectionsWalk` | `directions_walk` |
| Distance | `Icons.Outlined.Straighten` | `straighten` |
| Workout / exercise | `Icons.AutoMirrored.Outlined.DirectionsRun` | `directions_run` |
| Heart | `Icons.Outlined.Favorite` | `favorite_border` |
| Sleep | `Icons.Outlined.Bed` | `bed` |
| Calories | `Icons.Outlined.LocalFireDepartment` | `local_fire_department` |
| Hydration | `Icons.Outlined.LocalDrink` | `local_drink` |
| Nutrition | `Icons.Outlined.Restaurant` | `restaurant` |
| Mindfulness | `Icons.Outlined.SelfImprovement` | `self_improvement` |
| Cycle | `Icons.Outlined.CalendarMonth` | `calendar_month` |
| Body / weight | `Icons.Outlined.MonitorWeight` | `monitor_weight` |
| Vitals | `Icons.Outlined.DeviceThermostat` | `device_thermostat` |

*(Measured against the shipping Compose app 2026-08-04 — every metric resolves
to exactly one glyph, across 5 to 20 files each. Extend the table here first,
then code.)*

Two entries changed when this was re-measured against Compose, and both are the
app's answer rather than this file's:

- **Hydration is `local_drink`, not `water_drop`.** The app has used the cup
  glyph consistently in nine files; `water_drop` was this registry's own
  invention and never shipped. A drop reads as "a unit of water"; the cup reads
  as "a drink you logged", which is what the metric counts.
- **Steps, workout and other directional glyphs take `AutoMirrored`.** Compose
  makes RTL mirroring explicit where Flutter handled it implicitly, so the
  correct name carries it. This is a localisation requirement, not a style
  choice.

## Current state (re-measured 2026-08-04, Compose)

**Clean.** The Compose app carries **513** `Icons.Outlined.*` references and
**zero** `Icons.Filled.*` / `Icons.Default.*`, plus 66 `Icons.AutoMirrored.*`
for the directional glyphs. The outlined-only rule survived the migration back
from Flutter intact — it did not have to be re-applied.

The compiler is the enforcement: an `Icons.Outlined.*` name that does not exist
fails the build, so a typo cannot ship as a silently-filled glyph.

**One open violation, and it is not an icon.** `ActivityEntryState.kt` defines
four emoji (😀 🙂 😓 😖) for the activity "feeling" rating and
`ActivityEntryForm.kt` renders them. Rule 7 is absolute — icons carry all
visual shorthand — so this needs four outlined glyphs. Tracked as backlog;
picking the glyphs is a product call.
