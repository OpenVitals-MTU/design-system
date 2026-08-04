# Iteration 2 — audit, against Compose

> **Date:** 2026-08-04 · **Scope:** this design system vs. the shipping
> **Kotlin/Compose** app (`openvitals-android`, sibling checkout) vs. Material 3
> and WCAG 2.2.
> Same rule as iteration 1: every count below was measured against the source on
> the date above. Nothing is guessed, and nothing is carried over from
> [audit-1](audit-1.md) without being re-measured.

## Why there is a second audit

OpenVitals was ported to Flutter on 2026-07-09 and migrated back to
Kotlin/Compose on 2026-08-02. Iteration 1 audited the Flutter app. Everything it
*decided* still stands — the standards are about design, not about a framework —
but every *measurement* in it now describes a retired codebase, and several
fixes it recorded as "done" were done in Dart and did not travel.

The headline: **the fixes that lived in code came back undone; the fixes that
lived in this repository survived.** That is the argument for this repository
existing.

## Findings

### G1 — The metric accents were back to the failing swatches · **high · fixed**

Audit F-history records that the original Material-500 accents failed 3:1 on
eight of seventeen. The Compose app was shipping exactly those swatches again —
the audited palette had been derived on the Dart side and never existed here in
Kotlin.

Measured against the app's own surfaces (light `#FCFCFF`, dark `#1A1C1E`), worst
ratio of the two per accent:

| Accent | Was | Ratio | Now | Ratio |
|---|---|---|---|---|
| floors | `#FFC107` | **1.59** | `#A8881F` | 3.30 |
| elevation | `#8BC34A` | **2.05** | `#6E9440` | 3.43 |
| weight | `#FF9800` | **2.10** | `#BE7A2C` | 3.41 |
| workout | `#00BCD4` | **2.24** | `#2AA0A0` | 3.09 |
| sleep | `#673AB7` | **2.33** | `#6C5CD6` | 3.37 |
| hydration | `#03A9F4` | **2.57** | `#2E97C9` | 3.21 |
| body fat | `#795548` | **2.61** | `#8A6A55` | 3.48 |
| steps | `#4CAF50` | **2.71** | `#3F9A63` | 3.41 |

Eight of sixteen below the 3:1 floor for graphical objects; the accents are
drawn as chart strokes and icons, so that is the binding rule. The seventeenth
accent (wheelchair pushes) was absent from the app entirely.

**Fixed 2026-08-04** by adopting this system's palette, plus a
`MetricAccentContrastTest` in the app that **measures** contrast rather than
pinning hex values — a test that pinned hex would pass just as happily on a
palette someone had brightened.

### G2 — Card radius was 16 again · **medium · fixed**

`tokens/shape.css` already carried the story: the stray 16 came from the Compose
`AppShapes.medium`. The migration back brought that constant with it, so the app
drew 16dp corners against a documented 12. Fixed, and the app now has a `Radii`
scale (it had none — 21 call sites built a `RoundedCornerShape` by hand).

### G3 — Typography tracking was missing again · **medium · fixed**

F4.2's decision — adopt M3's letter spacing on body and title styles — was
implemented in Dart. The Compose `Type.kt` had the label tracking and nothing
else, exactly the state F4.2 described as "ported verbatim from the Compose app,
never decided". Fixed. The heavier headline/title **weights** are still the
brand and are now pinned by test.

### G4 — Motion had five unnamed durations · **medium · fixed**

F6 named four durations (120/300/550/1200). The Compose app had a `Motion`
object naming two of them, while call sites used 140, 450, 650, 1800 and 2800 —
five values, none of them the named ones. All four are now named and the call
sites route through them, with two documented exceptions kept at their call
sites rather than forced into the scale:

- the edit-mode wiggle (140ms) — an affordance, not decoration
- the mindfulness timer's pulse (1800/2800ms) — a breathing rhythm, not chrome

**Reduced motion did not exist outside the charts**, which had each implemented
it ad hoc. There is now one `LocalReducedMotion`, and the loops honour it.

### G5 — Four icon-only buttons announced nothing · **high · fixed**

Two settings steppers had `contentDescription = null` with no other label, so a
screen reader reached an interactive control and said nothing. Labelled from
each card's title. The convention already existed for eight neighbouring
steppers.

### G6 — Emoji in the product · **medium · fixed**

`ActivityEntryState.kt` defines 😀 🙂 😓 😖 for the activity "feeling" rating and
`ActivityEntryForm.kt` renders them. Iconography rule 7 is absolute: no emoji,
icons carry all visual shorthand. **Fixed 2026-08-04** with Material's outlined
sentiment glyphs, which map onto the four-step scale exactly. The reasons are
practical as well as stylistic: an emoji renders in the system emoji font, so it
ignores the colour scheme, changes shape between Android versions and vendor
skins, and cannot be tinted to carry selection state.

### G7 — Hydration's glyph was never `water_drop` · **info · registry corrected**

The registry said `water_drop_outlined`. The app has shipped
`Icons.Outlined.LocalDrink` in nine files, consistently, and did so in Flutter
too. This system invented the drop. The registry now says `local_drink`: the
cup reads as "a drink you logged", which is what the metric counts.

### G8 — Charts still have no semantics · **medium · fixed**

Audit-1 backlog item 5, unchanged and re-measured: **17 of 18** chart files in
`ui/charts/` carried no `contentDescription` and no `semantics` modifier: a
chart is a Canvas, so a screen-reader user went from the screen title straight
past it with no indication one existed.

**Fixed 2026-08-04** for the four chart families that are primary content —
line, bar, month heatmap, year heatmap. The summary is what a glance gives
(title, span, headline number), not a description of the drawing, and it is
composed in one helper so clauses do not reorder between charts a reader hears
back to back. No call site changed: each of these already took a title and a
summary string. Sparklines are deliberately left silent — they sit beside the
number they summarise, so a second reading of it is noise.

### G9 — Sentence case · **medium · fixed**

F3 re-measured against the Compose catalogue: **nine** first-party title-case
strings, the same order of magnitude F3 found and including the same examples —
*Daily Readiness*, *Body Energy*, *Recovery Mode*, *Add Marker*, *Data
Importers*, plus *Heart & Vitals*, *Stress Tracking*, *HRV Status* and the
*…Importer* titles. Garmin's terms stay capitalised. The app already contradicts
itself: `recovery_sleep_score` was already correctly "Sleep score".

**Fixed 2026-08-04**, eleven strings. Applied to the feature NAME wherever it
appears rather than only to the title — "Body Energy" was 13 occurrences, and a
title reading one way while the paragraph under it reads another is worse than
either choice made throughout. `SentenceCaseTest` guards the Garmin exemption in
both directions, so neither a regression nor an over-eager sweep can cross it.
English only: `values-XX/` is Weblate's, and German capitalises every noun.

### G10 — Literal discipline · **medium · standard now enforced**

F5 re-measured: **2,054** bare `dp` literals, **95** hand-written alphas, **16**
hand-built `RoundedCornerShape`s. Type discipline remains excellent.

The rule was prose, and prose does not stop a count going up. `TokenDisciplineTest`
is now a **ratchet**: the counts may fall, never rise. It is deliberately not a
migration — a blanket sweep would be actively wrong, because `16.dp` is
`Spacing.lg` when it is padding and nothing of the sort when it is an icon's
size, and no script can tell those apart. Migration stays per-screen under
golden cover; the ratchet stops new debt arriving behind it, and tightening the
ceiling is part of the migrating commit.

### G11 — A second, unaudited data palette · **high · open (new)**

The 17 metric accents are audited. Two further **data** palettes are not, and
were never in this system at all:

| Palette | Below 3:1 | Worst |
|---|---|---|
| Sleep stages (`stageColor`, 8 colours) | **7 of 8** | REM `#B3E5FC` at **1.32:1** on light |
| Nutrition groups (6 colours) | **2 of 6** | fat `#FFB300` at **1.75:1** on light |

REM is worse than the floors/amber (1.59) that prompted the original palette
work. These are drawn as hypnogram bands, lane fills, legend swatches and
dots — data, so the 3:1 graphical-object rule applies.

Two things keep this from being a straight repeat of G1, and both need a human
call rather than a sweep:

- **Colour is not the sole carrier here.** Every band and swatch has a label
  beside it, so the colour-independence rule is met and a reader is not lost —
  but the band-to-band *distinction* is still carried by hue alone.
- **It is a categorical series, not seventeen independent accents.** Eight sleep
  stages have to stay tellable apart from each other while each clears 3:1
  against both surfaces. That is a palette design problem, and it repaints the
  sleep hypnogram — a signature screen — so it wants a designer's eye and a
  device, not a numeric fix.

Recommend: derive both palettes the way the metric accents were derived (deeper,
less saturated, hue preserved), then extend `MetricAccentContrastTest` to cover
them so they cannot drift back.

## What the app already gets right

Re-measured, not assumed: **513** `Icons.Outlined.*` references and **zero**
`Icons.Filled.*`/`Icons.Default.*` — the outlined-only rule survived the
migration intact and did not have to be re-applied. One glyph per metric holds
across all twelve. The 48dp touch target, the 4dp spacing grid, the emphasis
ladder and every chart token (crosshair 40%, empty track 50%, grid 12%, baseline
22%, axis `outlineVariant` 80%, the seven canonical chart heights, stroke widths
and point radius) all match. The 200% text-scale sweep exists as an
instrumentation test.

## Backlog, in priority order

1. ~~Emoji → outlined glyphs (G6)~~ — **done** 2026-08-04, Material's outlined
   sentiment glyphs
2. ~~Chart semantic summaries (G8)~~ — **done** for the four chart families that
   are primary content; sparklines deliberately left silent, since they sit
   beside the number they summarise
3. ~~Sentence-case first-party strings (G9)~~ — **done**, eleven strings, with
   `SentenceCaseTest` guarding the Garmin exemption in both directions
4. **Sleep-stage and nutrition palettes (G11)** — 9 colours below 3:1; needs a
   designer's call, see above
5. Spacing/radius/alpha literal migration, per-screen with golden cover (G10) —
   ratcheted, not fixed
6. Raw `Color.White`/`Color.Black` (4, all chart scrims over coloured fills —
   plausibly legitimate) and hex `Color(0x…)` (27, of which 14 are the G11
   palettes) — annotate or resolve from the scheme
