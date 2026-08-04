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

### G12 — Component geometry was never checked, only tokens · **high · fixed**

Iterations 1 and 2 both audited the **token layer** — colour, radius, type
scale, motion — and treated conformance as settled once those matched. They
never compared a rendered component against `assets/screens/`, and the tokens
being right is not the same as the components being right.

Measured on a Pixel 6 Pro against `assets/screens/01-dashboard.png` (both
1440x3120, so directly comparable):

| | shipped Compose | reference | |
|---|---|---|---|
| Tile card height | 82dp | 82dp | match |
| Tile label | 12sp | 12sp | match |
| **Tile value** | **17sp** | **23sp** | value read as a caption |
| **Content position** | top gap 13dp, **bottom gap 43dp** | centred, 24dp / 25dp | half the card empty |
| **Top-bar title** | **32sp Bold** (`headlineLarge`) | ~28sp | 1.19x oversized |

Two causes, both invisible from the token layer:

- `MetricStatCard`'s content Row was `fillMaxWidth` inside a `fillMaxSize` Box.
  A wrap-height Row there pins to the TOP, and `verticalAlignment =
  CenterVertically` only centres the chip against the text — never the Row
  within the card. Given a fixed 82dp row height, the tile sat in the top third.
- The title used `headlineLarge` in a 64dp *small* top app bar.

**And this system was wrong too:** `MetricStatCard.jsx` specified the value as
`title-md` (16px), which is what the Compose app faithfully implemented. The
reference screenshot — the shipped product — is 22px. The component spec and the
screenshot in the same repository disagreed, and nobody had put them side by
side. Both are corrected: the spec now says `title-lg`, and the prompt records
the geometry so the next reader does not have to measure it off a PNG.

**The lesson for iteration 3:** matching tokens proves the vocabulary is shared,
not that the sentences are the same. Component-level checks belong in the audit
— against the reference screenshots, at the same scale, measured.

### G13 — The component specs understate the type scale · **medium · fixed here**

Iteration 3 swept the remaining components the way G12 swept the tile: each
`components/*.jsx` spec against the Compose implementation, and where they
disagreed, against `assets/screens/` at the same scale.

**The app came out clean.** No Compose change was needed from this sweep. What
it found instead is a pattern in THIS repository:

| Component | Spec said | Shipped / measured | Verdict |
|---|---|---|---|
| `MetricStatCard` value | `title-md` 16px | **22px** (G12) | spec understated |
| `MetricCard` value | `headline-sm` 24px | **~30px measured**, `headlineMedium` 28sp | spec understated |
| `SummaryRingCard` arc | opacity 0.72 | 0.65 | spec drifted |

Two of two type values were a full step small, in the same direction. These
`.jsx` files were written as plausible reconstructions rather than measured from
the product, and the giveaway is that both erred the same way: toward the
Material default and away from the brand's numbers-first emphasis. Both are
corrected, with the measurement recorded in a comment so the next reader can
check rather than re-guess.

Everything else matched, and the matches are worth recording because they are
what iteration 3 was for:

- `SummaryRingCard` — 130° start, 280° sweep, round caps, label-sm / headline-sm
  bold with tabular figures / label-sm. Exact.
- `MetricCard` — 16px padding, 8px gap, 20px icon, label-md title, body-sm
  subtitle. Exact apart from the value above.
- `DetailRow` — body-md on both sides. Exact.
- `AccentIconChip` — parameterised size and glyph, full radius. Exact.
- `Button` — full radius (`CircleShape`). Exact.

`ReadinessBanner` and `SettingsListItem` have no shared Compose counterpart —
they are feature-local and inline patterns respectively, which
[components-map](components-map.md) already records. There is nothing to
compare, and inventing a component to match a mock would be the tail wagging
the dog.

**Rule going forward:** a value in a `.jsx` component is a *reconstruction*
until a comment says what it was measured against. Treat an uncommented one as
a guess, and measure before propagating it into the app.

### G14 — The reference screenshots are themselves stale · **high · standard changed**

G12 corrected the tile against `assets/screens/01-dashboard.png` and moved the
value to 22sp. Measuring the **running Flutter build** — the actual last-shipped
product, still installed side by side — shows the tile value at **16sp**
(`titleMedium`) and the app-bar title at **titleLarge**, not the 22sp/28sp+ the
PNG shows. The G12 change overshot because it trusted a screenshot that predates
the product it documents.

Both apps now agree, verified by measuring the same glyphs ("kcal", 43px in
each) on the same device.

This reorders the authority chain, and the readme's rule follows from it:

1. **The running product** — when reachable, measure it. Nothing else counts as
   ground truth.
2. A `.jsx` spec **with a provenance comment** naming what it was measured
   against.
3. `assets/screens/` — persuasive for layout and colour, **not** for type sizes,
   until retaken from the current build.
4. An uncommented `.jsx` value — a guess (G13).

The dashboard's 32sp Bold title deserves its own note: it existed in the Compose
app only, survived POST-hoc justification twice ("the brand is numbers-first,
big bold numerals" — true for METRIC VALUES, wrongly stretched to chrome), and
matched neither the Flutter build nor M3's small-top-bar spec. The special case
is deleted rather than re-tuned; `largeTopBar` is gone from the scaffold API.

Backlog: retake all eight `assets/screens/` from the current Compose build once
the visual work settles.

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
