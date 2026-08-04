# Screen rhythm — the layout ruleset

> Established 2026-08-04 by measuring the shipped Flutter build and the Compose
> build side by side on a Pixel 6 Pro (both 1440×3120), band by band, and
> closing every difference. Values come from the Flutter source where it names
> them and from on-device measurement where it does not. Per
> [audit-2 G14](audit-2.md): the running product is the authority; nothing here
> is guessed.

## Global rules — every screen

| Rule | Value | Where it lives (Compose) |
|---|---|---|
| Scaffold background | `surface` — dark `#1A1C1E`. `background == surface`; the deeper `#101416` never shipped | `Theme.kt` dark scheme |
| Top app bar | **56dp**, title `title-lg` SemiBold. Flutter's `AppBar` keeps M2's toolbar height under M3; the 64dp M3 spec value was never drawn | `OpenVitalsAdaptiveScaffold.kt` |
| Bottom nav bar | 80dp (M3 default), outlined→filled selection | stock `NavigationBar` |
| Screen gutter | 16 | `DashboardScreenPadding` / per-screen |
| Card gap in lists | 8 (as two 4s, or one 8 spacer) | `SettingsCardSpacer`, card `vertical: 4` wrappers |
| Card padding | 16 | `OpenVitalsCard` content |
| Card corner | 12 (`radius-md`) | `shapes.medium` |
| Scroll bodies | vertical 8 content padding; the system-nav inset is reserved at the bottom | see "Insets" below |
| **Line-height boxes** | Text claims its style's FULL line height, single line included | `Type.kt`, `Trim.None` on every style |

The line-height rule is the one that bites silently: Flutter and the web honour
the line-height box by default, Compose trims a lone line to glyph metrics.
Before it was fixed, every stacked-text card in the Android app ran ~9dp short
(settings categories: 69dp against the shipped 78dp) with every individual
constant — padding, gaps, type sizes — *identical*. If a card is mysteriously
tighter than a mock, check the text boxes before touching the padding.

## Max content width

| Screens | Cap |
|---|---|
| Metric detail scaffold, settings, achievements, body energy, caffeine | **920dp** |
| Sleep score / efficiency detail, training readiness detail | **1080dp** |
| Dashboard, stress details, cardio load | 1080dp in Compose; the Flutter build left these three unconstrained. Kept capped deliberately — invisible on phones, more consistent on tablets |

## Metric detail scaffold rhythm

Top to bottom (`MetricDetailScaffold` / `metric_detail_scaffold.dart` — the two
implementations match):

- scroll body: vertical 8
- sync banner (when shown): h16 v4
- time-range selector: v8
- period navigator: h16 v8
- …content items (cards at h16 v4 each → 8 between)
- tail spacer: 16

## Dashboard rhythm

Top to bottom, all measured equal on both builds:

| Section | Spec |
|---|---|
| Scroll padding | top 4, bottom 24 |
| Day navigator | h16 v4 |
| Hero rings | top 16, **square** (half the content width each, 12 gap) — not stacked tile rows |
| Quick actions | top 14, buttons 48 tall |
| Divider | 16 above, 1dp rule, 8 below |
| Carousel | top 8; tiles **82** tall, 12 gaps both axes; pages h16 |
| Page dots | top 12, bottom 4; 8dp dots, 4dp apart |

Metric tile internals: 28dp accent chip (16dp glyph), `10×12` padding, content
**vertically centred**, label `label-md` (12), value `title-md` (16), 3dp
progress underline at 55% accent.

## Insets (edge-to-edge)

The app draws edge to edge, so the system navigation bar is painted over the
body. The rule: **the bar's height is reserved so content can always scroll
clear of it.** The two implementations honour it differently, and both are
correct:

- Flutter: `screenScrollPadding` adds the inset *inside* each scrollable, so
  content scrolls out from under the bar.
- Compose: the scaffold's `innerPadding` wraps the nav host, so content stops
  above the bar.

Do not "unify" these — each is the idiomatic form on its surface. What is not
allowed is a scrollable that reserves nothing: on a three-button nav bar the
last row ends up underneath it, which is how the rule was discovered.

## How to verify a screen

The method that produced every number above:

1. Screenshot both builds on the same device (`adb shell screencap`).
2. Band-diff: scan a column for page↔card transitions; compare band heights and
   gaps in dp (`px / density`).
3. Where a delta shows, find the constant in the source — Flutter names most of
   them — and fix the code, not the screenshot.
4. Re-measure. A match is equal band tables, not a similar-looking picture.

Beware the two traps this process hit: reference *screenshots* go stale
([G14](audit-2.md)) and reference *specs* can be unmeasured reconstructions
([G13](audit-2.md)). The running product outranks both.
