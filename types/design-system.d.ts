// The components _ds_bundle.js puts on window, as the screens in ui_kits/ read them.
import type { Button } from '../components/buttons/Button'
import type { IconButton } from '../components/buttons/IconButton'
import type { Card } from '../components/cards/Card'
import type { MetricCard } from '../components/cards/MetricCard'
import type { MetricStatCard } from '../components/cards/MetricStatCard'
import type { SummaryRingCard } from '../components/cards/SummaryRingCard'
import type { MetricBarChart } from '../components/charts/MetricBarChart'
import type { MetricLineChart } from '../components/charts/MetricLineChart'
import type { PeriodHeatmap } from '../components/charts/PeriodHeatmap'
import type { Sparkline } from '../components/charts/Sparkline'
import type { AccentIconChip } from '../components/data-display/AccentIconChip'
import type { DetailRow } from '../components/data-display/DetailRow'
import type { Icon } from '../components/data-display/Icon'
import type { ReadinessBanner } from '../components/data-display/ReadinessBanner'
import type { SettingsListItem } from '../components/data-display/SettingsListItem'
import type { Checkbox } from '../components/forms/Checkbox'
import type { RadioGroup } from '../components/forms/RadioGroup'
import type { Select } from '../components/forms/Select'
import type { Slider } from '../components/forms/Slider'
import type { Switch } from '../components/forms/Switch'
import type { TextField } from '../components/forms/TextField'
import type { AchievementBadge } from '../components/insights/AchievementBadge'
import type { CrossMetricInsightCard } from '../components/insights/CrossMetricInsightCard'
import type { DataConfidenceCard } from '../components/insights/DataConfidenceCard'
import type { SensorStatusCard } from '../components/insights/SensorStatusCard'
import type { BottomNavBar } from '../components/navigation/BottomNavBar'
import type { DateNavigator } from '../components/navigation/DateNavigator'
import type { SectionHeader } from '../components/navigation/SectionHeader'
import type { TimeRangeSelector } from '../components/navigation/TimeRangeSelector'
import type { TopBar } from '../components/navigation/TopBar'

declare global {
  interface Window {
    OpenVitalsDesignSystem_626946: {
      Button: typeof Button
      IconButton: typeof IconButton
      Card: typeof Card
      MetricCard: typeof MetricCard
      MetricStatCard: typeof MetricStatCard
      SummaryRingCard: typeof SummaryRingCard
      MetricBarChart: typeof MetricBarChart
      MetricLineChart: typeof MetricLineChart
      PeriodHeatmap: typeof PeriodHeatmap
      Sparkline: typeof Sparkline
      AccentIconChip: typeof AccentIconChip
      DetailRow: typeof DetailRow
      Icon: typeof Icon
      ReadinessBanner: typeof ReadinessBanner
      SettingsListItem: typeof SettingsListItem
      Checkbox: typeof Checkbox
      RadioGroup: typeof RadioGroup
      Select: typeof Select
      Slider: typeof Slider
      Switch: typeof Switch
      TextField: typeof TextField
      AchievementBadge: typeof AchievementBadge
      CrossMetricInsightCard: typeof CrossMetricInsightCard
      DataConfidenceCard: typeof DataConfidenceCard
      SensorStatusCard: typeof SensorStatusCard
      BottomNavBar: typeof BottomNavBar
      DateNavigator: typeof DateNavigator
      SectionHeader: typeof SectionHeader
      TimeRangeSelector: typeof TimeRangeSelector
      TopBar: typeof TopBar
    }
  }

  /** What the router in ui_kits/openvitals-app/index.html passes every screen. */
  interface ScreenProps {
    nav: (route: string) => void
  }
}

export {}
