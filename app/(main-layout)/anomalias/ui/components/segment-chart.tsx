export function SegmentChart({
  baseline,
  meanConsumption,
}: {
  baseline: number
  meanConsumption: number
}) {
  const max = Math.max(baseline, meanConsumption) * 1.15
  const min = Math.min(baseline, meanConsumption) * 0.55
  const range = max - min || 1
  const toY = (value: number) => 88 - ((value - min) / range) * 68
  const baselineY = toY(baseline)
  const peakY = toY(meanConsumption)

  const linePoints = [
    [8, baselineY],
    [48, baselineY - 2],
    [88, toY(baseline + (meanConsumption - baseline) * 0.35)],
    [128, toY(baseline + (meanConsumption - baseline) * 0.75)],
    [168, peakY + 2],
    [208, peakY],
    [248, peakY + 4],
    [288, toY(meanConsumption * 0.92)],
    [328, toY(meanConsumption * 0.88)],
  ] as const

  const polyline = linePoints.map(([x, y]) => `${x},${y}`).join(" ")
  const area = `8,100 ${polyline} 328,100`

  return (
    <svg
      viewBox="0 0 336 100"
      className="h-28 w-full"
      role="img"
      aria-label="Segmento temporal de consumo"
    >
      <defs>
        <linearGradient id="anomaly-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(251 113 133)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(251 113 133)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line
        x1="8"
        x2="328"
        y1={baselineY}
        y2={baselineY}
        stroke="rgb(100 116 139)"
        strokeDasharray="4 4"
        strokeWidth="1"
      />
      <polygon points={area} fill="url(#anomaly-fill)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="rgb(251 113 133)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="208" cy={peakY} r="3.5" fill="rgb(251 113 133)" />
    </svg>
  )
}
