"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Current } from "../../types/meter-detail.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { cn } from "cn"

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

type Metric = "consumption" | "variables"
type Range = "week" | "day"

const SERIES_COLORS = {
  consumption: "var(--chart-1)",
  baseline: "var(--chart-2)",
  voltage: "#38bdf8",
  current: "#fbbf24",
  powerFactor: "#c084fc",
} as const

const chartConfig = {
  consumption: {
    label: "Consumo Real (kW)",
    color: SERIES_COLORS.consumption,
  },
  voltage: {
    label: "Voltaje (V)",
    color: SERIES_COLORS.voltage,
  },
  current: {
    label: "Corriente (A)",
    color: SERIES_COLORS.current,
  },
  powerFactor: {
    label: "Factor de potencia",
    color: SERIES_COLORS.powerFactor,
  },
} satisfies ChartConfig

const METRIC_OPTIONS: { value: Metric; label: string }[] = [
  { value: "consumption", label: "Consumo (kW)" },
  { value: "variables", label: "Variables V / A / FP" },
]

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: "week", label: "Última semana" },
  { value: "day", label: "24 h" },
]

export function MeterDemandChart({
  history,
  baseline,
}: {
  history: Current[]
  baseline: number
}) {
  const [metric, setMetric] = useState<Metric>("consumption")
  const [range, setRange] = useState<Range>("week")

  const data = useMemo(
    () =>
      history
        .map((point) => ({
          ...point,
          timestamp: new Date(point.timestamp).getTime(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp),
    [history]
  )

  const filtered = useMemo(() => {
    const latest = data.reduce(
      (max, point) => Math.max(max, point.timestamp),
      0
    )
    const from = latest - (range === "week" ? WEEK_MS : DAY_MS)
    return data.filter((point) => point.timestamp >= from)
  }, [data, range])

  const legend =
    metric === "consumption"
      ? [
          {
            key: "consumption",
            label: "Consumo Real (kW)",
            color: SERIES_COLORS.consumption,
            dashed: false,
          },
          {
            key: "baseline",
            label: `Baseline ${baseline.toFixed(2)} kW`,
            color: SERIES_COLORS.baseline,
            dashed: true,
          },
        ]
      : [
          {
            key: "voltage",
            label: "Voltaje (V)",
            color: SERIES_COLORS.voltage,
            dashed: false,
          },
          {
            key: "current",
            label: "Corriente (A)",
            color: SERIES_COLORS.current,
            dashed: false,
          },
          {
            key: "powerFactor",
            label: "Factor de potencia",
            color: SERIES_COLORS.powerFactor,
            dashed: false,
          },
        ]

  return (
    <Card className="bg-[#0B1120]">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Zap className="size-4.5 text-emerald-500" /> Curva historia demanda
            electrica
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <FilterGroup
              options={METRIC_OPTIONS}
              value={metric}
              onChange={setMetric}
            />
            <FilterGroup
              options={RANGE_OPTIONS}
              value={range}
              onChange={setRange}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          {legend.map((item) => (
            <span key={item.key} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block h-0.5 w-4",
                  item.dashed && "border-t border-dashed bg-transparent"
                )}
                style={
                  item.dashed
                    ? { borderColor: item.color }
                    : { backgroundColor: item.color }
                }
              />
              {item.label}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="flex h-80 items-center justify-center text-sm text-slate-400">
            No hay lecturas en este rango.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ComposedChart
              data={filtered}
              margin={{ top: 16, right: 72, left: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="fillConsumption"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-consumption)"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-consumption)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                minTickGap={32}
                tickFormatter={(value) =>
                  format(value, range === "day" ? "HH:mm" : "dd MMM", {
                    locale: es,
                  })
                }
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  metric === "consumption" ? `${value} kW` : String(value)
                }
                width={56}
              />
              {metric === "variables" && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 1]}
                  width={40}
                />
              )}
              <ChartTooltip
                content={({ active, payload }) => {
                  const point = payload?.[0]?.payload as
                    (typeof filtered)[number] | undefined
                  if (!active || !point) return null
                  return (
                    <div className="rounded-lg border bg-popover px-3 py-2 text-sm">
                      <p>
                        {format(point.timestamp, "dd MMM, HH:mm 'UTC'", {
                          locale: es,
                        })}
                      </p>
                      {metric === "consumption" ? (
                        <>
                          <p className="font-semibold">
                            {point.consumption.toFixed(2)} kW
                          </p>
                          <p className="text-muted-foreground">
                            V: {point.voltage.toFixed(1)}V · I:{" "}
                            {point.current.toFixed(1)}A · FP:{" "}
                            {point.powerFactor.toFixed(3)}
                          </p>
                        </>
                      ) : (
                        <div className="mt-1 space-y-0.5">
                          <p style={{ color: "var(--color-voltage)" }}>
                            V: {point.voltage.toFixed(1)} V
                          </p>
                          <p style={{ color: "var(--color-current)" }}>
                            I: {point.current.toFixed(1)} A
                          </p>
                          <p style={{ color: "var(--color-powerFactor)" }}>
                            FP: {point.powerFactor.toFixed(3)}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                }}
              />
              {metric === "consumption" && (
                <ReferenceLine
                  yAxisId="left"
                  y={baseline}
                  stroke={SERIES_COLORS.baseline}
                  strokeDasharray="6 6"
                  label={{
                    value: `${baseline.toFixed(2)} kW`,
                    position: "right",
                    fill: "#94a3b8",
                  }}
                />
              )}
              {metric === "consumption" ? (
                <Area
                  yAxisId="left"
                  dataKey="consumption"
                  type="monotone"
                  fill="url(#fillConsumption)"
                  stroke="var(--color-consumption)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-consumption)" }}
                  activeDot={{ r: 6 }}
                />
              ) : (
                <>
                  <Line
                    yAxisId="left"
                    dataKey="voltage"
                    type="monotone"
                    stroke="var(--color-voltage)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    yAxisId="left"
                    dataKey="current"
                    type="monotone"
                    stroke="var(--color-current)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    dataKey="powerFactor"
                    type="monotone"
                    stroke="var(--color-powerFactor)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </>
              )}
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

function FilterGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex rounded-lg bg-white/5 p-1">
      {options.map((option) => {
        const active = option.value === value

        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant="ghost"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "text-slate-300 hover:bg-white/10 hover:text-white",
              active &&
                "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
            )}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
