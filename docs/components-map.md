# Component inventory — this system ↔ the Flutter app

> The two inventories drifted (audit F8). This table is the reconciliation and
> the registry: **a new shared widget lands here in the same change that
> creates it.** Feature-local widgets don't register; anything in the app's
> `lib/ui/components/` or `lib/ui/charts/` does.

Status legend — **match**: exists both sides · **stock**: Flutter uses plain
Material 3, correctly, and this system's version exists only for web mocks ·
**app-only**: shipped in Flutter, missing here · **mock-only**: exists here
with no Flutter counterpart · **pattern**: not a widget in Flutter, an inline
convention.

## Foundations & containers

| This system | Flutter | Status | Notes |
|---|---|---|---|
| `Card` | `OpenVitalsCard` (`ov_card.dart`) | match | Variant gap: web has `neutral\|metric\|accent\|error`; Flutter ships neutral + colour override, `OpenVitalsSurface` adds `metric`. Add variants on demand, never speculatively. |
| — | `OpenVitalsSurface` (`ov_surface.dart`) | app-only | The inset tinted sub-section container. |
| `Icon` | Flutter `Icon` | stock | See [iconography.md](iconography.md) — different font families, same glyphs. |
| `Button` (filled/tonal/outlined/text) | `FilledButton` / `.tonal` / `OutlinedButton` / `TextButton` | stock | Pill shape is M3 default. |
| `IconButton` (plain/surface) | `IconButton` | stock | 48dp target floor applies. |

## Navigation & flow

| This system | Flutter | Status | Notes |
|---|---|---|---|
| `TopBar` | adaptive scaffold app bar | match | 64dp = M3 small top app bar. |
| `BottomNavBar` | nav suite in `adaptive_scaffold.dart` | match | 80dp = M3; outlined→filled selected pairing. |
| `DateNavigator` | `DayNavigator` / `PeriodNavigator` (`period_navigator.dart`) | match | Naming drift only. |
| `TimeRangeSelector` | period-mode segmented control | match | |
| `SectionHeader` | inline `Text` + `sectionPadded` | pattern | Flutter never made it a widget; fine, but then this system's component is mock-only sugar. |
| — | `StepBar`, `StepDots`, `StepHero` (`step_bar.dart`) | app-only | The wizard chrome (onboarding, CSV import, device sync). |
| — | `InstructionSteps` | app-only | Numbered walkthrough; numbering generated, one string per step. |

## Data display & insights

| This system | Flutter | Status |
|---|---|---|
| `MetricCard` | `metric_card.dart` | match |
| `MetricStatCard` | `metric_stat_card.dart` | match |
| `SummaryRingCard` | `summary_ring_card.dart` | match |
| `AccentIconChip` | `accent_icon_chip.dart` | match |
| `DataConfidenceCard` | `data_confidence_card.dart` | match |
| `CrossMetricInsightCard` | `cross_metric_insight_card.dart` | match |
| `ReadinessBanner` | feature-side (daily readiness) | match (feature-local) |
| `SensorStatusCard` | feature-side; dashboard body deliberately omits it | match (feature-local) |
| `AchievementBadge` | feature-side (achievements) | match (feature-local) |
| `SettingsListItem` | settings section rows | pattern |
| `DetailRow` | inline label/value rows | pattern |
| — | `PermissionCallout` | app-only — the point-of-use permission ask (CSV import). Dashboard prompts were removed by policy: **asking happens at point of use, never on the home screen.** |
| — | `HealthConnectGate` | app-only — full-screen availability/permission gate. |

## Charts

| This system | Flutter | Status |
|---|---|---|
| `MetricLineChart` | `line_chart.dart` / `metric_line_plot.dart` | match |
| `MetricBarChart` | `bar_chart.dart` / `chart_bar_row.dart` | match |
| `Sparkline` | `sparkline_chart.dart` | match |
| `PeriodHeatmap` | `heatmap_chart.dart` | match |
| — | `RingGauge`, schedule/session/day axes, scrubber, zoom, reveal, skeleton, empty state | app-only — the chart apparatus is far richer in Flutter; this system carries only the four presentational faces. Chart *tokens* are mirrored (`tokens/charts.css` ↔ `chart_tokens.dart`), which is the part that must not drift. |

## Forms

`Switch`, `Checkbox`, `RadioGroup`, `Slider`, `TextField`, `Select` — all
**stock** Material 3 in Flutter, which is correct. This system's copies exist
so web mocks look like the product; they define no contract the app must
follow.
