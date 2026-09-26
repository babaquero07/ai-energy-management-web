"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  AlertCircle,
  Astroid,
  Gauge,
  LucideIcon,
  ShieldAlert,
  Zap,
} from "lucide-react"
import { useMemo } from "react"
import { DashboardSummaryRes } from "../../types/dashboard.types"
import { cn } from "@/lib/utils"

interface Kpis {
  title: string
  titleColor: string
  value: number
  description: string
  icon: LucideIcon
  iconColor: string
  bgColor: string
  valueColor: string
}

export function KpiCards({ data }: DashboardSummaryRes) {
  const kpis: Kpis[] = useMemo(() => {
    return [
      {
        title: "Total de medidores",
        titleColor: "text-muted-foreground",
        value: data.meters,
        description: "Nodos conectados",
        icon: Gauge,
        iconColor: "text-muted-foreground",
        bgColor: "bg-primary/10",
        valueColor: "text-white",
      },
      {
        title: "Consumo total",
        titleColor: "text-muted-foreground",
        value: data.totalConsumption,
        description: "kWh periodo activo acumulador",
        icon: Zap,
        iconColor: "text-muted-foreground",
        bgColor: "bg-primary/10",
        valueColor: "text-white",
      },
      {
        title: "Anomalías",
        titleColor: "text-muted-foreground",
        value: data.anomalies,
        description: "Eventos registrados",
        icon: AlertCircle,
        iconColor: "text-muted-foreground",
        bgColor: "bg-primary/10",
        valueColor: "text-white",
      },
      {
        title: "Alta prioridad",
        titleColor: "text-red-400/90",
        value: data.highPriorityAnomalies,
        description: "Requiere atención inmediata",
        icon: ShieldAlert,
        iconColor: "text-red-400/90",
        bgColor: "bg-red-500/10",
        valueColor: "text-red-400/90",
      },
      {
        title: "Confianza IA",
        titleColor: "text-muted-foreground",
        value: data.aiConfidence,
        description: "Nivel de certeza del modelo",
        icon: Astroid,
        iconColor: "text-emerald-500",
        bgColor: "bg-primary/10",
        valueColor: "text-emerald-500",
      },
    ]
  }, [data])

  return (
    <ul className="flex flex-wrap items-center gap-8">
      {kpis.map(
        (
          {
            title,
            titleColor,
            value,
            description,
            icon: Icon,
            bgColor,
            valueColor,
            iconColor,
          },
          index
        ) => (
          <li key={index}>
            <Card
              className={cn(
                "min-h-40 w-57.5 rounded-lg border border-accent/90 pt-4 pb-6 transition-all duration-300 hover:scale-105",
                bgColor
              )}
            >
              <CardHeader>
                <CardTitle
                  className={cn(
                    "flex w-full items-center justify-between font-medium",
                    titleColor
                  )}
                >
                  {title}
                  <Icon className={cn("size-5", iconColor)} />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <span
                  className={cn("text-2xl font-bold text-white", valueColor)}
                >
                  {value}
                </span>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </li>
        )
      )}
    </ul>
  )
}
