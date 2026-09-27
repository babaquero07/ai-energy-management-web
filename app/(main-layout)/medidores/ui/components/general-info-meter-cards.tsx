import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "cn"
import { Gauge, LucideIcon, Radio, RadioOff, WrenchIcon } from "lucide-react"
import { useMemo } from "react"

interface GeneralInfoMeterCardsProps {
  data: {
    actives: number
    inactives: number
    maintenances: number
    total: number
  }
}

interface Card {
  title: string
  value: number
  description: string
  icon: LucideIcon
}

export function GeneralInfoMeterCards({ data }: GeneralInfoMeterCardsProps) {
  const cards = useMemo(() => {
    const { actives, inactives, maintenances, total } = data

    return [
      {
        title: "Total",
        value: total,
        description: "registrados",
        icon: Gauge,
      },
      {
        title: "Activos",
        value: actives,
        description: "en línea",
        icon: Radio,
      },
      {
        title: "Inactivos",
        value: inactives,
        description: "desconectados",
        icon: RadioOff,
      },
      {
        title: "En mantenimiento",
        value: maintenances,
        description: "en revisión",
        icon: WrenchIcon,
      },
    ]
  }, [data])

  return (
    <ul className="flex flex-wrap gap-6">
      {cards.map(({ title, value, description, icon: Icon }, index) => (
        <li key={index}>
          <Card
            className={cn(
              "min-w-55 rounded-lg border border-accent/90 bg-[#0B1120] transition-all duration-300 hover:scale-105"
            )}
          >
            <CardHeader>
              <CardTitle
                className={cn(
                  "flex w-full items-center justify-between text-sm text-white uppercase"
                )}
              >
                {title}
                <Icon className={cn("size-4.5")} />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className={cn("text-[26px] font-bold text-indigo-200")}>
                {value}{" "}
                <span className="text-sm font-light text-muted-foreground">
                  {description}
                </span>
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
