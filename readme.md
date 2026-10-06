# OpenVitals Design System

A design system for **OpenVitals** — a privacy-first Health Connect dashboard,
activity tracker, and manual-entry app for Android. This project lets design
agents build well-branded OpenVitals interfaces and assets — production or
throwaway mocks — grounded in the app's real Material 3 theme.

> **Product in one line:** review Health Connect data, record or import workouts,
> and add manual entries — no account, no cloud sync, no ads, no analytics.
> Health Connect stays the source of truth; the dashboard is read-only by default.

## Sources

Everything here is grounded in the OpenVitals source, not guessed.

**OpenVitals is a Kotlin/Jetpack Compose app.** It was Flutter/Dart between
2026-07-09 and 2026-08-02 and has been migrated back; the `mobile-app` checkout
is retired.

This system is its own repository. The paths below are relative to the **Android
app** checkout ([`OpenVitals-MTU/android-app`](https://github.com/OpenVitals-MTU/android-app), a sibling of this one), rooted at
`app/src/main/kotlin/tech/mmarca/openvitals/`.

| What | Where |
|---|---|
| Colour scheme, brand + metric accents | `ui/theme/Color.kt`, `Theme.kt` |
| Type scale | `ui/theme/Type.kt` |
| Spacing, radii, emphasis, motion, metrics | `ui/theme/DesignTokens.kt` |
| Reduced-motion contract | `ui/theme/ReducedMotion.kt` |
| Chart chrome + chart layout | `ui/charts/ChartTokens.kt`, `ChartAxis.kt` |
| Card / surface primitives | `ui/components/DetailCards.kt` (`OpenVitalsCard`) |
| Everything else shared | `ui/components/`, `ui/charts/` |

> **The lesson that produced this note is about DRIFT, not about which language
> the app is written in.** All seventeen metric accents once fell a full
> accessibility pass behind the shipping app, because the shipping side
> re-derived the palette for WCAG contrast and this system never heard about it.
> That happened again in the other direction across the 2026-08 migration back
> to Kotlin: the Compose app was still carrying the stock Material-500 swatches,
> eight of which failed 3:1 — fixed 2026-08-04 by adopting the audited palette
> here, with a contrast test in the app to stop it recurring.
>
> **If a value here disagrees with the app's `ui/theme/`, the app is right and
> this file is stale** — and the disagreement itself is the bug worth chasing.

- **Android app repository:** https://github.com/OpenVitals-MTU/android-app
- **Reference screenshots:** `assets/screens/` (dashboard, onboarding, settings,
  daily readiness, body energy, activity detail, activity recording, beverage entry)
- **App icon:** `assets/openvitals-icon.png` (single copy — the duplicate `uploads/` tree was removed in iteration 1)

### Which way authority runs

The two sides are each authoritative where they did the work:

- **Values** — colour, type, the colour schemes: **the code wins.** They ship, and
  the palette is contrast-audited. This system mirrors them.
- **Scales and contracts** — the spacing grid, the radius scale, component
  metrics, touch targets, component props: **this system wins.** The app holds
  these as named objects in `ui/theme/DesignTokens.kt` (`Spacing`, `Radii`,
  `Emphasis`, `Motion`, `LayoutMetrics`); screens that still use bare numbers are
  being migrated onto them.

### A note on color: dynamic vs. canonical
OpenVitals ships with **Material You dynamic color ON by default**, so on a real
device the whole chrome is re-tinted from the user's wallpaper. Every reference
screenshot shows a **warm terracotta** dynamic instance. The app's *own* static
color scheme (used when dynamic color is unavailable) is **blue primary + teal
tertiary on cool neutrals**.

This system carries **both**:
- **Canonical** (`:root`) — the static blue/teal scheme, verbatim from `Theme.kt`.
  Deterministic, brand-owned. Use for production defaults.
- **Warm** (`[data-theme="warm"]`) — the sampled dynamic instance from the
  screenshots. Use when a mock should match the photographed product. Opt in per
  container with `data-theme="warm"`.
- **Dark** (`[data-theme="dark"]`) and **AMOLED** (`[data-theme="amoled"]`) — the
  app's static dark schemes, verbatim from `Theme.kt`.

Metric accent colors, type, shape, and spacing are fixed from source and shared
by both.

---

## Content fundamentals

How OpenVitals writes copy:

- **Voice:** calm, factual, slightly clinical but plain-spoken. It states what the
  data says and what to do, without hype. e.g. *"Do moderate training today, but
  avoid maximal effort."*
- **Person:** addresses the user as **you / your** ("Your health data, on your
  device", "Your signals suggest…"). First person is never used.
- **Casing:** **Sentence case** everywhere — titles, buttons, list items
  ("Start workout", "Sensors & devices", "Grant Health Connect access").
  An earlier version of this rule cited *"Daily Readiness"* as its own example —
  which is title case; the app still carries a handful of such strings and they
  are tracked as audit backlog (docs/audit-1.md, F3). **Exception:** third-party
  product terms keep their trademark casing (Garmin's *Body Battery*, *Sleep
  Coach*, *Training Readiness*). ALL-CAPS is reserved for small section labels
  ("HEALTH CONNECT PERMISSIONS") via label-style tracking.
- **Numbers first:** metric values are the loudest element; units and context are
  secondary ("**19,576** steps of 8,000", "**65**/100", "**2h 46m**").
- **Honesty about data:** copy openly hedges confidence — "Medium confidence ·
  sleep data missing", "low confidence estimate", "Some timeline buckets have
  sparse Health Connect data." This candor is a brand trait; keep it.
- **Privacy framing:** leads with what does *not* happen ("No account required.
  Data stays on your device. No cloud upload, no analytics, no ads.").
- **Emoji:** none. **Icons** carry all visual shorthand.
- **Health disclaimers:** wellness/informational framing, never medical claims.

---

## Visual foundations

- **Type:** Roboto (the Material 3 default — the app declares no custom font), with
  Roboto Mono available for tabular metric contexts. Material 3 type scale verbatim
  from `ui/theme/Type.kt`. Big bold numerals (`headlineLarge` 32/700), semibold
  titles, regular body. `headlineMedium` carries tabular figures.
- **Color:** restrained. Neutral surfaces with **one accent per metric** (steps
  green, distance blue, sleep purple, heart pink, calories red, hydration light
  blue, workout cyan…). Accents appear on **icons, chart strokes, small progress
  indicators** — never as full saturated card backgrounds. Card weight comes from
  surface tone, not color. Every accent clears **3:1 contrast against both light
  and dark surfaces**; they are deeper and less saturated than the stock Material
  swatches on purpose, because a health chart's line should read as a measurement
  and not as a highlighter. Do not brighten one without re-measuring it.
- **Surfaces & depth:** cards are **flat (0 elevation)**. Depth is expressed by a
  tonal ladder of `surfaceContainer` steps (lowest → highest), not shadows.
  Shadows appear only on truly lifted surfaces (dialogs, FAB, the phone frame).
- **Corners:** everything is rounded. Cards use **12px** (`md`) — the 16px this
  file used to claim came from the Compose `AppShapes.medium`, which carried it
  again after the migration back and was corrected 2026-08-04, and
  never matched a shipped pixel. Segmented pills and selectors **24px** (`lg`);
  hero/onboarding **32px** (`xl`); small chips/inputs **12px** (`sm`, the same
  value as cards today); progress fills **8px** (`xs`). Icon buttons are full
  circles.
- **Backgrounds:** solid single-tone surface. **No** gradients, images, textures,
  or patterns behind content. The only "image" is the app icon.
- **Progress motifs:** open **arc rings** (280° sweep, gap at the bottom, round
  caps) for hero stats; **3px accent underlines** pinned to the bottom of stat
  tiles; thin linear bands elsewhere. Ring/underline fills are the accent at
  ~55–72% alpha over an `outlineVariant` track.
- **Icon chips:** small accent-tinted circles (accent at 14–16% alpha, colored
  glyph) mark metrics and list rows.
- **Buttons:** pill-shaped (fully rounded), ~40–48px tall. Filled = primary
  action, tonal = secondary (the dashboard "Log"/"Start" pair), outlined/text =
  low emphasis.
- **Hover / press:** subtle `brightness()` shift on press (~0.93–0.94); cards lift
  by tone on hover. No scale/bounce. Disabled = 38% opacity (Material standard).
- **Motion:** minimal and functional — short 120ms ease transitions on
  press/hover, swipe to change date/period. No decorative or looping animation.
- **Layout:** single scrolling column, **16px screen gutters**, 4dp spacing grid,
  8–12px gaps between cards. Two-up grids for stat tiles and summary rings. Top app
  bar is transparent over the background with no divider.
- **Transparency / blur:** essentially none — surfaces are opaque tones. Accent
  tints are the only alpha usage.

---

## Iconography

- **Icon set:** **Material Symbols Outlined** — the app uses Jetpack Compose
  `androidx.compose.material.icons` (`Icons.Outlined.*`, e.g. `Add`, `DirectionsRun`,
  `Settings`, `ChevronLeft`, `CalendarMonth`, `Edit`, `Bed`, `Bluetooth`). We load
  the matching **Material Symbols Outlined** webfont from Google Fonts (see
  `tokens/fonts.css`) and wrap it in the `Icon` component. This is the genuine
  Material set, not a substitute.
- **Weight/fill:** outlined (FILL 0), weight 500, optical size matched to px size.
- **Usage:** icons are tinted with the metric accent inside chips, or
  `on-surface` / `on-surface-variant` for neutral chrome (top bar, chevrons, list
  rows). One glyph per metric — consistent across dashboard, detail, and settings.
- **Emoji / unicode icons:** never used.
- **Logo:** the OpenVitals app icon (`assets/openvitals-icon.png`) is the only
  brand mark — a teal disc with a peach seated figure + waveform. It is a real
  supplied asset; do not redraw or reconstruct it. Where a wordmark is needed, set
  **"OpenVitals" in Roboto Bold** (see the Brand foundation card).

---

## Index — what's in this project

**Standards (iteration 1 — read these first)**
- `docs/screen-rhythm.md` — the layout ruleset: global rules, per-screen rhythm, insets, and the measure-the-product method
- `docs/audit-2.md` — the current measured audit (Compose): findings, dispositions, backlog
- `docs/audit-1.md` — the iteration-1 audit, retained as the Flutter-era record
- `docs/iconography.md` — outlined-only rule, metric glyph registry
- `docs/accessibility.md` — contrast, 48dp targets, 200% type, semantics, motion
- `docs/components-map.md` — this system ↔ Compose composable reconciliation

**Foundations**
- `styles.css` — global entry point (import this one file)
- `tokens/colors.css` — canonical + warm palettes, metric accents
- `tokens/typography.css` — Material 3 type scale + utility classes
- `tokens/shape.css` — corner radii + elevation
- `tokens/spacing.css` — 4dp grid + component metrics (48dp touch floor)
- `tokens/motion.css` — durations measured from the app, easings, reduced motion
- `tokens/charts.css` — chart chrome (axis, track, grid/area/baseline alphas) and
  chart layout (per-kind heights, axis gutters, strokes)
- `tokens/fonts.css` — Roboto, Roboto Mono, Material Symbols Outlined
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand)

**Components** (`components/…`, React primitives — namespace `OpenVitalsDesignSystem_626946`)
- **buttons/** — `Button` (filled/tonal/outlined/text), `IconButton` (plain/surface)
- **cards/** — `Card`, `MetricStatCard`, `SummaryRingCard`, `MetricCard`
- **navigation/** — `TopBar`, `DateNavigator`, `TimeRangeSelector`, `SectionHeader`, `BottomNavBar`
- **data-display/** — `Icon`, `AccentIconChip`, `DetailRow`, `SettingsListItem`, `ReadinessBanner`
- **charts/** — `MetricLineChart`, `MetricBarChart`, `Sparkline`, `PeriodHeatmap`
- **forms/** — `Switch`, `Checkbox`, `RadioGroup`, `Slider`, `TextField`, `Select`
- **insights/** — `DataConfidenceCard`, `AchievementBadge`, `CrossMetricInsightCard`, `SensorStatusCard`

Full component list: `AccentIconChip`, `AchievementBadge`, `BottomNavBar`, `Button`,
`Card`, `Checkbox`, `CrossMetricInsightCard`, `DataConfidenceCard`, `DateNavigator`,
`DetailRow`, `Icon`, `IconButton`, `MetricBarChart`, `MetricCard`, `MetricLineChart`,
`MetricStatCard`, `PeriodHeatmap`, `RadioGroup`, `ReadinessBanner`, `SectionHeader`,
`Select`, `SensorStatusCard`, `SettingsListItem`, `Slider`, `Sparkline`,
`SummaryRingCard`, `Switch`, `TextField`, `TimeRangeSelector`, `TopBar`.

**UI kit**
- `ui_kits/openvitals-app/` — interactive click-through of the app (dashboard,
  daily readiness, settings, beverage entry, activity detail, recording)

**Assets**
- `assets/openvitals-icon.png` — app icon
- `assets/screens/` — 8 reference screenshots

**Intentional additions.** The source's icons are Compose `ImageVector`s, not a
web component. We add a thin **`Icon`** wrapper over the Material Symbols Outlined
webfont so components and mocks have a consistent glyph API. Everything else maps
1:1 to a primitive defined in the OpenVitals source.

## Substitutions & caveats
- **Fonts:** Roboto is the *actual* Material 3 default OpenVitals renders in (no
  custom font in source) — loaded from Google Fonts, not an approximation. If you
  have a specific bundled font, share it and it will be swapped in.
- **Warm palette:** the warm chrome tokens are *sampled from the screenshots*
  (Material You is wallpaper-derived and per-device); structural tokens, type,
  shape, and metric accents are exact from source.

## License

The OpenVitals design system is licensed under the [`GNU Affero General Public License v3.0 or later`](LICENSE).
