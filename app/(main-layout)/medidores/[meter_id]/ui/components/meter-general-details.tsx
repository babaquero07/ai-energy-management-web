import { Calendar, Clock, LucideIcon, MapPin } from "lucide-react"
import { useMemo } from "react"

interface MeterGeneralDetailsProps {
  data: {
    location: string
    created_at: Date
    last_reading_date: Date
  }
}

interface Item {
  icon: LucideIcon
  label: string
  value: string | Date
}

export function MeterGeneralDetails({ data }: MeterGeneralDetailsProps) {
  const { location, created_at, last_reading_date } = data

  const items: Item[] = useMemo(
    () => [
      {
        icon: MapPin,
        label: "Ubicación",
        value: location,
      },
      {
        icon: Calendar,
        label: "Registrado",
        value: new Date(created_at).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
      {
        icon: Clock,
        label: "Última lectura",
        value: new Date(last_reading_date).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ],
    [location, created_at, last_reading_date]
  )

  return (
    <ul className="flex items-center gap-3">
      {items.map(({ icon: Icon, label, value }, index) => (
        <li key={index} className="flex items-center gap-2">
          <Icon className="size-4 text-violet-200" />
          <span className="text-muted-foreground">
            {label}: <span className="text-white">{value as string}</span>
          </span>

          {index !== items.length - 1 && (
            <span className="size-1 rounded-full bg-muted-foreground" />
          )}
        </li>
      ))}
    </ul>
  )
}
