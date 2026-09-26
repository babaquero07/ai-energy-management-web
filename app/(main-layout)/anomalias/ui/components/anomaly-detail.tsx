"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AlertTriangle,
  Check,
  Clock,
  Info,
  Loader2,
  Sparkles,
  X,
} from "lucide-react"
import {
  AnomalyDetailResponse,
  AnomalyStatus,
  Signals,
} from "../../types/anomalies-types.type"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { Separator } from "@/components/ui/separator"
import { AnomalyMetaBadges } from "./anomaly-meta-badges"
import { AnomalyMetricsCards } from "./anomaly-metrics-cards"
import { SegmentChart } from "./segment-chart"
import { cn } from "@/lib/utils"

interface AnomalyDetailProps {
  anomaly_id: number
}

const SIGNAL_ITEMS: { key: keyof Signals; label: string }[] = [
  { key: "consumptionSpike", label: "Pico de consumo" },
  { key: "persistentBaselineChange", label: "Cambio de baseline" },
  { key: "outliers", label: "Valores atípicos" },
  { key: "abnormalHourlyPattern", label: "Patrón horario" },
  { key: "dataQuality", label: "Falla de sensor" },
  { key: "anomalousElectricalRelation", label: "Relación eléctrica" },
]

function formatSegmentDate(value: Date | string) {
  return new Date(value).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export default function AnomalyDetail({ anomaly_id }: AnomalyDetailProps) {
  const queryClient = useQueryClient()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["anomaly-detail", anomaly_id],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/anomalies/${anomaly_id}`
      )
      if (!res.ok) {
        throw new Error("No se pudo obtener el detalle de la anomalía")
      }

      return (await res.json()) as AnomalyDetailResponse
    },
  })

  const updateAnomalyMutation = useMutation<
    { success: boolean; message: string },
    Error,
    number
  >({
    mutationKey: ["update-anomaly", anomaly_id],
    mutationFn: async (anomaly_id: number) => {
      const res = await fetch(
        `http://localhost:3000/api/ai/analysis/${anomaly_id}`,
        {
          method: "PATCH",
        }
      )

      if (!res.ok) {
        throw new Error("No se pudo actualizar la anomalía")
      }

      return (await res.json()) as { success: boolean; message: string }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.add({
          type: "success",
          title: "Anomalía actualizada",
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["anomaly-detail", anomaly_id],
      })
    },
    onError: (error) => {
      console.error(error)

      toast.add({
        type: "error",
        title: "Error al actualizar la anomalía",
        description:
          "Inténtalo de nuevo. Si el problema persiste, contacta al soporte.",
        timeout: 5000,
      })
    },
  })

  useEffect(() => {
    if (!isError) return

    toast.add({
      type: "warning",
      title: "Error al obtener el detalle de la anomalía",
      description: error?.message || "Inténtalo de nuevo",
    })
  }, [isError, error])

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        No se pudo cargar el detalle de la anomalía.
      </p>
    )
  }

  const { analysis_data: analysis } = data
  const activeSignals = SIGNAL_ITEMS.filter(
    (item) => analysis.signals[item.key]
  ).length
  const confidencePct = Math.round(data.confidence * 100)
  const showAiButton = data.status === AnomalyStatus.DETECTED

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 pr-8">
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <AlertTriangle className="size-5 text-red-500" />
          Detalle de Anomalía — {data.meter_id}
        </DialogTitle>

        <div className="flex flex-wrap items-center gap-2">
          <AnomalyMetaBadges
            type={data.type}
            severity={data.severity}
            status={data.status}
          />
          <span className="ml-auto text-sm text-slate-400">
            Confianza IA:{" "}
            <span className="font-semibold text-emerald-400">
              {confidencePct}%
            </span>
          </span>
        </div>
      </div>

      <AnomalyMetricsCards
        baseline={analysis.baseline}
        variationPercent={analysis.variation_percent}
        maxAbsZ={analysis.max_abs_z}
        worstPowerResidual={analysis.worst_power_residual}
      />

      {analysis.segment && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-medium text-white">
              <Clock className="size-4 text-slate-400" />
              Segmento Temporal
            </h3>
            <p className="text-xs text-slate-400 sm:text-sm">
              {formatSegmentDate(analysis.segment.from)} —{" "}
              {formatSegmentDate(analysis.segment.to)}
              <span className="mx-1.5 text-slate-600">·</span>
              <span className="font-medium text-sky-400">
                {analysis.segment.hours}h
              </span>
              <span className="mx-1.5 text-slate-600">·</span>
              Media:{" "}
              <span className="font-medium text-rose-300">
                {analysis.segment.meanConsumption.toFixed(2)} kW
              </span>
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2">
            <SegmentChart
              baseline={analysis.baseline}
              meanConsumption={analysis.segment.meanConsumption}
            />
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <h3 className="text-[11px] tracking-wider text-slate-500 uppercase">
          Señales de Inferencia ({activeSignals}/{SIGNAL_ITEMS.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIGNAL_ITEMS.map(({ key, label }) => {
            const active = analysis.signals[key]
            return (
              <span
                key={key}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs",
                  active
                    ? "border-slate-700 bg-slate-900/80 text-slate-200"
                    : "border-slate-800 bg-slate-950/50 text-slate-500 line-through"
                )}
              >
                {active ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <X className="size-3.5 text-slate-500" />
                )}
                {label}
              </span>
            )
          })}
        </div>
      </section>

      <div className="rounded-lg border border-slate-700/80 bg-slate-800/50 px-4 py-3">
        <p className="flex items-start gap-2 text-sm text-slate-200">
          <Info className="mt-0.5 size-4 shrink-0 text-sky-400" />
          <span>
            <span className="font-semibold text-white">Diagnóstico: </span>
            {data.reason}
          </span>
        </p>
        <p className="mt-2 pl-6 text-sm text-slate-200">
          <span className="font-semibold text-white">Acción recomendada: </span>
          {data.recommended_action}
        </p>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <DialogClose
          render={
            <Button
              variant="secondary"
              className="cursor-pointer bg-slate-800 text-white hover:bg-slate-700"
            />
          }
        >
          Cerrar
        </DialogClose>
        {showAiButton && (
          <Button
            onClick={() => updateAnomalyMutation.mutate(anomaly_id)}
            disabled={updateAnomalyMutation.isPending}
            className={cn(
              "cursor-pointer bg-[#10B981] font-semibold text-[#0F172A] hover:bg-emerald-500",
              updateAnomalyMutation.isPending && "text-white"
            )}
          >
            {updateAnomalyMutation.isPending ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {updateAnomalyMutation.isPending
              ? "Analizando..."
              : "Analizar datos con IA"}
          </Button>
        )}
      </div>
    </div>
  )
}
