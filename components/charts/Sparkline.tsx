import React from 'react';
import type { SparklineProps } from './Sparkline.d';

/**
 * Sparkline — a tiny inline accent trend line (no axes/labels), for embedding
 * in metric cards and rows. Mirrors MetricSparklineChart.
 */
export function Sparkline({
  data = [],
  accentColor = 'var(--ov-primary)',
  width = 96,
  height = 28,
  strokeWidth = 2,
  style,
  ...rest
}: SparklineProps) {
  const vals = data.length ? data : [0, 0];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const pad = strokeWidth;
  const x = (i: number) => pad + (i / Math.max(1, vals.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - lo) / span) * (height - pad * 2);
  const d = vals.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', ...style }} {...rest}>
      <path d={d} fill="none" stroke={accentColor} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
