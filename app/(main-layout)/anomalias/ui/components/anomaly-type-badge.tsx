import { AnomalyType } from "../../types/anomalies-types.type"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function AnomalyTypeBadge({ type }: { type: AnomalyType }) {
  const anomalyTypeColors = {
    backgroundColors: {
      [AnomalyType.REAL_ANOMALY]: "bg-red-500/20",
      [AnomalyType.EXPLAINABLE_ANOMALY]: "bg-blue-500/20",
      [AnomalyType.FALSE_POSITIVE]: "bg-yellow-500/20",
      [AnomalyType.DATA_QUALITY]: "bg-green-500/20",
      [AnomalyType.PENDING_ANALYSIS]: "bg-gray-500/20",
    },
    textColors: {
      [AnomalyType.REAL_ANOMALY]: "text-red-500/95",
      [AnomalyType.EXPLAINABLE_ANOMALY]: "text-blue-500/95",
      [AnomalyType.FALSE_POSITIVE]: "text-yellow-500/95",
      [AnomalyType.DATA_QUALITY]: "text-green-500/95",
      [AnomalyType.PENDING_ANALYSIS]: "text-gray-500/95",
    },
  }

  const backgroundColor = anomalyTypeColors.backgroundColors[type]
  const textColor = anomalyTypeColors.textColors[type]

  return (
    <Badge className={cn("rounded-sm px-4 py-3", backgroundColor, textColor)}>
      <span
        className={cn(
          "mr-1 size-2.5 animate-pulse rounded-full",
          backgroundColor
        )}
      />
      {type}
    </Badge>
  )
}
