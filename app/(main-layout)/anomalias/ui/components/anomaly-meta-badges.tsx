import {
  AnomalySeverity,
  AnomalyStatus,
  AnomalyType,
} from "../../types/anomalies-types.type"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const typeBadgeClass: Record<AnomalyType, string> = {
  [AnomalyType.REAL_ANOMALY]: "bg-red-600 text-white",
  [AnomalyType.EXPLAINABLE_ANOMALY]: "bg-blue-600 text-white",
  [AnomalyType.FALSE_POSITIVE]: "bg-amber-600 text-white",
  [AnomalyType.DATA_QUALITY]: "bg-emerald-700 text-white",
  [AnomalyType.PENDING_ANALYSIS]: "bg-slate-600 text-white",
}

const severityBadgeClass: Record<AnomalySeverity, string> = {
  [AnomalySeverity.LOW]: "bg-slate-700 text-white",
  [AnomalySeverity.MEDIUM]: "bg-slate-700 text-white",
  [AnomalySeverity.HIGH]: "bg-slate-700 text-white",
  [AnomalySeverity.PENDING]: "bg-slate-700 text-white",
}

const statusBadgeClass: Record<AnomalyStatus, string> = {
  [AnomalyStatus.COMPLETED]: "bg-emerald-600/90 text-white",
  [AnomalyStatus.ANALYZING]: "bg-amber-600/90 text-white",
  [AnomalyStatus.FAILED]: "bg-red-700/90 text-white",
  [AnomalyStatus.RESOLVED]: "bg-sky-700/90 text-white",
  [AnomalyStatus.DETECTED]: "bg-slate-600/90 text-white",
}

const badgeBaseClass =
  "rounded-sm px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase"

interface AnomalyMetaBadgesProps {
  type: AnomalyType
  severity: AnomalySeverity
  status: AnomalyStatus
  className?: string
}

export function AnomalyMetaBadges({
  type,
  severity,
  status,
  className,
}: AnomalyMetaBadgesProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Badge className={cn(badgeBaseClass, typeBadgeClass[type])}>{type}</Badge>
      <Badge className={cn(badgeBaseClass, severityBadgeClass[severity])}>
        {severity}
      </Badge>
      <Badge className={cn(badgeBaseClass, statusBadgeClass[status])}>
        <span className="size-1.5 rounded-full bg-current" />
        {status}
      </Badge>
    </div>
  )
}
