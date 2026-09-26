"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BatteryFull, Gauge, LucideIcon, PowerIcon, Zap } from "lucide-react"
import { useMemo } from "react"

interface MeterDetailsCardsProps {
  data: {
    consumption: number
    voltage: number
    current: number
    powerFactor: number
    baseline: number
    variation_percentage: number
  }
}

interface Card {
  title: string
  icon: LucideIcon
  value: number
  valueText: string
  description: React.ReactNode
}

export function MeterDetailsCards({ data }: MeterDetailsCardsProps) {
  const {
    consumption,
    voltage,
    current,
    powerFactor,
    baseline,
    variation_percentage,
  } = data

  const cards = useMemo(
    () => [
      {
        title: "Consumo actual",
        icon: Zap,
        value: consumption,
        valueText: "kW",
        description: (
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground">
              Baseline: {baseline} kW
            </span>
            <span className="text-white">{variation_percentage} %</span>
          </div>
        ),
      },
      {
        title: "Voltaje",
        icon: BatteryFull,
        value: voltage,
        valueText: "V",
        description: (
          <span className="text-muted-foreground">Nominal: {voltage}V</span>
        ),
      },
      {
        title: "Corriente",
        icon: PowerIcon,
        value: current,
        valueText: "A",
        description: (
          <span className="text-muted-foreground">Carga operativa</span>
        ),
      },
      {
        title: "Factor de potencia",
        icon: Gauge,
        value: powerFactor,
        valueText: "FP",
        description: (
          <span className="text-muted-foreground">Regimen inductivo</span>
        ),
      },
    ],
    [consumption, voltage, current, powerFactor]
  )

  return (
    <ul className="flex flex-wrap gap-6">
      {cards.map(
        ({ title, value, valueText, description, icon: Icon }, index) => (
          <li key={index}>
            <Card className="min-w-65 rounded-lg border border-accent/90 bg-primary/10 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex w-full items-center justify-between text-sm text-white uppercase">
                  {title}
                  <Icon className="size-4.5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-[26px] font-bold text-white">
                  {value}{" "}
                  <span className="text-base font-medium text-indigo-200">
                    {valueText}
                  </span>
                </p>
              </CardContent>
              <CardFooter className="bg-transparent">{description}</CardFooter>
            </Card>
          </li>
        )
      )}
    </ul>
  )
}
