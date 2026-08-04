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

### G6 — Emoji in the product · **medium · open**

`ActivityEntryState.kt` defines 😀 🙂 😓 😖 for the activity "feeling" rating and
`ActivityEntryForm.kt` renders them. Iconography rule 7 is absolute: no emoji,
icons carry all visual shorthand. Needs four outlined glyphs; picking them is a
product call, so it is backlog rather than a silent change.

### G7 — Hydration's glyph was never `water_drop` · **info · registry corrected**

The registry said `water_drop_outlined`. The app has shipped
`Icons.Outlined.LocalDrink` in nine files, consistently, and did so in Flutter
too. This system invented the drop. The registry now says `local_drink`: the
cup reads as "a drink you logged", which is what the metric counts.

### G8 — Charts still have no semantics · **medium · open**

Audit-1 backlog item 5, unchanged and re-measured: **17 of 18** chart files in
`ui/charts/` carry no `contentDescription` and no `semantics` modifier. Every
chart is invisible to a screen reader.

### G9 — Sentence case · **medium · open**

F3 re-measured against the Compose catalogue: **nine** first-party title-case
strings, the same order of magnitude F3 found and including the same examples —
*Daily Readiness*, *Body Energy*, *Recovery Mode*, *Add Marker*, *Data
Importers*, plus *Heart & Vitals*, *Stress Tracking*, *HRV Status* and the
*…Importer* titles. Garmin's terms stay capitalised. The app already contradicts
itself: `recovery_sleep_score` is correctly "Sleep score". Still l10n churn
across five catalogues — one commit, not a sweep.

### G10 — Literal discipline · **medium · standard restated**

F5 re-measured: **2,075** bare `dp` literals, **95** hand-written alphas, **21**
hand-built `RoundedCornerShape`s. Type discipline remains excellent. The rule is
unchanged and unchanged in force: **no bare numbers for spacing, radius, or
alpha in new code**; migration is per-screen with golden cover.

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

1. Emoji → outlined glyphs in the activity feeling selector (G6)
2. Chart semantic summaries — 17 files (G8)
3. Sentence-case first-party strings, 5 catalogues (G9)
4. Spacing/radius/alpha literal migration, per-screen with golden cover (G10)
5. Raw `Color.White`/`Color.Black` (4) and hex `Color(0x…)` (27) outside the
   theme — annotate or resolve from the scheme
