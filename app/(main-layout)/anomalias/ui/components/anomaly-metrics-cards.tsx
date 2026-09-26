import { ArrowUpRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnomalyMetricsCardsProps {
  baseline: number
  variationPercent: number
  maxAbsZ: number
  worstPowerResidual: number
  className?: string
}

export function AnomalyMetricsCards({
  baseline,
  variationPercent,
  maxAbsZ,
  worstPowerResidual,
  className,
}: AnomalyMetricsCardsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      <Card
        size="sm"
        className="rounded-lg border border-slate-800 bg-slate-900/60 ring-0"
      >
        <CardHeader className="pb-0">
          <CardTitle className="text-[11px] tracking-wide text-slate-400 uppercase">
            Baseline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-white">
            {baseline.toFixed(2)}{" "}
            <span className="text-sm font-medium text-slate-400">kW</span>
          </p>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="rounded-lg border border-slate-800 bg-slate-900/60 ring-0"
      >
        <CardHeader className="pb-0">
          <CardTitle className="text-[11px] tracking-wide text-slate-400 uppercase">
            Variación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex items-center gap-1 text-lg font-semibold text-white">
            {variationPercent > 0 ? "+" : ""}
            {variationPercent.toFixed(1)}%
            {variationPercent > 0 && (
              <ArrowUpRight className="size-4 text-emerald-400" />
            )}
          </p>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="rounded-lg border border-slate-800 bg-slate-900/60 ring-0"
      >
        <CardHeader className="pb-0">
          <CardTitle className="text-[11px] tracking-wide text-slate-400 uppercase">
            Z-Score Máx
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-orange-300">
            {maxAbsZ.toFixed(2)}{" "}
            <span className="text-sm font-medium">σ</span>
          </p>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="rounded-lg border border-slate-800 bg-slate-900/60 ring-0"
      >
        <CardHeader className="pb-0">
          <CardTitle className="text-[11px] tracking-wide text-slate-400 uppercase">
            Residuo Potencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-sky-300">
            {worstPowerResidual.toFixed(3)}{" "}
            <span className="text-sm font-medium">p.u.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
