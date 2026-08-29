# Component inventory — this system ↔ the Compose app

> The two inventories drifted (audit F8). This table is the reconciliation and
> the registry: **a new shared composable lands here in the same change that
> creates it.** Feature-local composables don't register; anything in the app's
> `ui/components/` or `ui/charts/` does.
>
> Re-measured 2026-08-04 against the Kotlin/Compose app, after the migration
> back from Flutter. Paths are relative to
> `app/src/main/kotlin/tech/mmarca/openvitals/`.

Status legend — **match**: exists both sides · **stock**: the app uses plain
Material 3, correctly, and this system's version exists only for web mocks ·
**app-only**: shipped in the app, missing here · **mock-only**: exists here with
no app counterpart · **pattern**: not a composable in the app, an inline
convention.

## Foundations & containers

| This system | Compose app | Status | Notes |
|---|---|---|---|
| `Card` | `OpenVitalsCard` (`ui/components/DetailCards.kt`) | match | Variant gap: web has `neutral\|metric\|accent\|error`; the app's `OpenVitalsCardStyle` carries all four. Corner is `MaterialTheme.shapes.medium` = 12dp. |
| — | `OpenVitalsSurface` (`ui/components/DetailCards.kt`) | app-only | The inset tinted sub-section container. |
| `Icon` | Compose `Icon` | stock | See [iconography.md](iconography.md) — different font families, same glyphs. |
| `Button` (filled/tonal/outlined/text) | `Button` / `FilledTonalButton` / `OutlinedButton` / `TextButton` | stock | Pill shape is M3 default. |
| `IconButton` (plain/surface) | `IconButton` | stock | 48dp target floor applies; the `Icon` inside needs a `contentDescription` unless the button is labelled another way. |

## Navigation & flow

| This system | Compose app | Status | Notes |
|---|---|---|---|
| `TopBar` | adaptive scaffold app bar (`ui/components/OpenVitalsAdaptiveScaffold.kt`) | match | 64dp = M3 small top app bar. |
| `BottomNavBar` | navigation suite in `OpenVitalsAdaptiveScaffold.kt` | match | 80dp = M3; outlined→filled selected pairing. |
| `DateNavigator` | `DayNavigator` (`ui/components/DateNavigation.kt`) / `PeriodNavigator` (`ui/components/PeriodNavigator.kt`) | match | Naming drift only. |
| `TimeRangeSelector` | period-mode segmented control | match | |
| `SectionHeader` | inline `Text` + section padding | pattern | Never made a shared composable; fine, but then this system's component is mock-only sugar. |
| — | `StepBar`, `InstructionSteps` (`ui/components/StepBar.kt`) | app-only | The wizard chrome (onboarding, CSV import, device sync). `InstructionSteps` generates its own numbering, so translators get one string per step and screen readers get list structure. |

## Data display & insights

| This system | Compose app | Status |
|---|---|---|
| `MetricCard` | `ui/components/MetricCard.kt` | match |
| `MetricStatCard` | `features/dashboard/components/MetricStatCard.kt` | match (feature-local) |
| `SummaryRingCard` | `features/dashboard/components/` ring composables | match (feature-local) |
| — | `CountdownRing` (`ui/components/CountdownRing.kt`) | app-only | A full-circle ring that empties clockwise as a timed plan step or rest runs out, digits in the middle. Frame-driven against the end instant so it sweeps smoothly; steps once a second under reduced motion. Decorative: the digits carry the value. |
| `AccentIconChip` | `ui/components/DetailCards.kt` | match |
| `DataConfidenceCard` | `ui/components/DataConfidenceCard.kt` | match |
| `CrossMetricInsightCard` | `ui/components/CrossMetricInsightCard.kt` | match |
| `ReadinessBanner` | feature-side (daily readiness) | match (feature-local) |
| `SensorStatusCard` | feature-side; dashboard body deliberately omits it | match (feature-local) |
| `AchievementBadge` | feature-side (`features/achievements/`) | match (feature-local) |
| `SettingsListItem` | settings section rows (`features/settings/SettingsCards.kt`) | pattern |
| `DetailRow` | `ui/components/DetailCards.kt` | match |
| — | `PermissionCallout` (`ui/components/PermissionCallout.kt`) | app-only — the point-of-use permission ask. Dashboard prompts were removed by policy: **asking happens at point of use, never on the home screen.** |
| — | `HealthConnectAccessGate` (`ui/components/HealthConnectAccessGate.kt`) | app-only — full-screen availability/permission gate, wrapped by `HealthConnectScreenShell`. |
| — | `MetricDetailScaffold` (`ui/components/MetricDetailScaffold.kt`) | app-only — the shared shell every metric detail screen is built from. |

## Charts

| This system | Compose app | Status |
|---|---|---|
| `MetricLineChart` | `ui/charts/MetricLineChart.kt` | match |
| `MetricBarChart` | `ui/charts/MetricBarChart.kt` | match |
| `Sparkline` | `ui/charts/MetricSparklineChart.kt` | match |
| `PeriodHeatmap` | `ui/charts/PeriodHeatmap.kt` | match |
| — | `PeriodChart`, `ChartAxis`, `ChartScrubber`, `ChartZoom`, `ChartViewport`, `ChartReveal`, `ChartSkeleton`, `ChartEmptyState`, `ChartCurve`, `ChartDecimation`, `ChartAggregation`, `ChartTimeAxes`, `BucketedSeries` | app-only — the chart apparatus is far richer in the app; this system carries only the four presentational faces. Chart *tokens* are mirrored (`tokens/charts.css` ↔ `ui/charts/ChartTokens.kt`), which is the part that must not drift. |

**Known gap (accessibility backlog 5):** 17 of the app's 18 chart files carry no
semantics at all. Every chart needs a one-line summary label — "Steps, 8,000
goal, 6,432 today" — or it is invisible to a screen reader.

## Forms

`Switch`, `Checkbox`, `RadioGroup`, `Slider`, `TextField`, `Select` — all
**stock** Material 3 in the app, which is correct. This system's copies exist so
web mocks look like the product; they define no contract the app must follow.
