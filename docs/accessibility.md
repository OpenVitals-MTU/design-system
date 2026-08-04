# Accessibility floors

> These are floors, not aspirations: a change that dips below one is a defect,
> not a style choice. A health app's audience skews *toward* older eyes, tremor,
> and screen readers — accessibility here is core audience, not edge case.

## Contrast

| What | Floor | Source |
|---|---|---|
| Body text vs its surface | **4.5:1** | WCAG 1.4.3 AA |
| Large text (≥18pt / 14pt bold) | 3:1 | WCAG 1.4.3 AA |
| Graphical objects: chart strokes, icons, progress | **3:1** | WCAG 1.4.11 |

The 17 metric accents are audited against **both** static surfaces — worst case
3.09:1, with barely any headroom. The palette's history is the warning: the
original Material-500 swatches failed eight of seventeen (floors/gold measured
1.59:1). **Never brighten an accent without re-measuring against light and dark
surfaces.** Dynamic colour re-tints chrome but not accents, so the static
surfaces remain the binding constraint; AMOLED (near-black) only increases
contrast and never binds.

## Touch targets

**48×48dp minimum for anything tappable** — Material 3's floor, applied by
Compose through `MinimumInteractiveComponentSize` on its Material components;
WCAG 2.5.8's 24px is the absolute lower bound we never approach. Token:
`--ov-min-touch-target` / `LayoutMetrics.minTouchTarget`. Visual containers may
be smaller (24dp glyph, 40dp icon button) provided the hit area pads out. A bare
`Modifier.clickable` gets none of this for free — size it, or wrap it in a
component that does.

## Text scaling

The app must survive **200%** text scale — and this is *tested*, not promised:
`ui/TextScalingSweepTest.kt` (instrumentation) sweeps key screens at 2.0. Rules
that keep it true: no fixed-height containers around text; `Text` never wrapped
in hard clips; rows that can't fit wrap or scroll, never truncate a value.

## Color independence

Colour is never the sole carrier of meaning. The house precedent is the heatmap:
a day with **no reading** is `--ov-chart-empty-track`, visually distinct from a
day whose reading is zero — state is carried by tone *and* the empty-track
token, not hue alone. Same rule everywhere: pair colour with an icon, a label,
or a count.

Related (audit F12): metric accents live only on data — icons, strokes, small
indicators — never on interactive chrome, so a wallpaper-derived `primary`
converging on an accent can't make a control impersonate a metric.

## Semantics

- Decorative elements are **excluded**: pass `contentDescription = null` on an
  `Icon` that only decorates labelled content, and use
  `Modifier.clearAndSetSemantics {}` for a composed decoration like step dots,
  whose step is already announced by the heading.
- Every tappable has a label; an icon-only button always sets a
  `contentDescription` on its `Icon` or a `Modifier.semantics` label on itself.
  `contentDescription = null` inside an `IconButton` with no other text is the
  failure mode — it produces a control a screen reader announces as nothing.
  Four settings steppers shipped that way until 2026-08-04.
- Generated numbering (e.g. `InstructionSteps`) is produced by the widget, not
  baked into strings — so screen readers get list structure, and translators
  never manage "1.".
- **Known gap:** charts are visual-only today. Each chart needs a one-line
  semantic summary ("Steps, 8,000 goal, 6,432 today"). Backlog item 5.

## Motion

Honor reduced motion — `prefers-reduced-motion` on web; on Android there is no
such query, so the signal is the system animator duration scale, which "Remove
animations" drives to zero and `ValueAnimator.areAnimatorsEnabled()` reports.
The app resolves it once per theme into `LocalReducedMotion`, with
`animationDuration()` for tweens and `loopingMotionAllowed()` as the gate before
starting anything that repeats.

Reveals and ambient sweeps drop to zero; functional feedback stays ≤
`--ov-motion-press` (120ms). Repeating animation is the kind that never settles,
so it is the kind this matters most for. Two loops exist and both stop under
reduced motion: the edit-mode wiggle (an affordance — it says a tile can be
dragged) and the mindfulness timer's breathing pulse. Neither is decorative, and
nothing decorative is to be added.

## Localization

Sentence case per the copy standard; third-party product names (Garmin's *Body
Battery* et al.) keep their trademark casing. Strings never assume LTR-only
layouts; paths and instructions are lists of separate strings, never
arrow-concatenated prose (see `InstructionSteps` rationale).
