**MetricStatCard** — the compact dashboard stat tile (Distance, Total calories, Elevation…). Accent icon chip on the left, title + value stacked, optional thin accent progress underline.

```jsx
<MetricStatCard title="Distance" value="18.6" unit="km"
  icon="straighten" accentColor="var(--ov-metric-distance)" progress={0.9} />
```

Use a `--ov-metric-*` token for `accentColor`. Pair with `SummaryRingCard` above the fold and grid these two-up below it.

**Geometry** (measured against `assets/screens/01-dashboard.png`, 2026-08-04):
82dp tall in the dashboard grid, `10px 12px` padding, 28dp accent chip with a
16dp glyph, 10px gap. Content is **vertically centred** in the card — a tile
whose content hugs the top leaves a third of the card empty and reads as
unfinished. Title is label-md, value **title-lg** (the loudest element),
subtitle label-sm, progress underline 3px at 55% accent.
