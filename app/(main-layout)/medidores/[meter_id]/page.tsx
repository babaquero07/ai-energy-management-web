import { Metadata } from "next"
import { MeterDetailResponse } from "./types/meter-detail.types"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MeterGeneralDetails } from "./ui/components/meter-general-details"
import { MeterDetailsCards } from "./ui/components/meter-details-cards"
import { DataTable } from "@/components/shared/data-table"
import { meterDetailColumns } from "./ui/components/meter-detail-columns"

export const metadata: Metadata = {
  title: "Detalle Medidor",
  description: "Detalle del medidor",
}

interface MeterPageProps {
  params: Promise<{
    meter_id: string
  }>
}

export default async function MeterPage({ params }: MeterPageProps) {
  const { meter_id } = await params

  const res: MeterDetailResponse | null = await fetch(
    `http://localhost:3000/api/meters/${meter_id}`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err)
      return null
    })

  if (!res?.data) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">
            Detalle de medidor - {res.data.name}
          </h1>
          <Badge
            variant="outline"
            className={cn(
              "rounded-xs p-3.5 text-sm",
              res.data.status === "Activo"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500",
              res.data.status === "Mantenimiento"
                ? "bg-yellow-500/10 text-yellow-500"
                : ""
            )}
          >
            {res.data.meter_id}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "rounded-xl p-3",
              res.data.status === "Activo"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500",
              res.data.status === "Mantenimiento"
                ? "bg-yellow-500/10 text-yellow-500"
                : ""
            )}
          >
            <span
              className={cn(
                "size-2 animate-pulse rounded-full",
                res.data.status === "Activo" ? "bg-emerald-500" : "bg-red-500",
                res.data.status === "Mantenimiento" ? "bg-yellow-500" : ""
              )}
            />
            {res.data.status}
          </Badge>
        </div>

        <MeterGeneralDetails
          data={{
            location: res.data.location,
            created_at: res.data.created_at,
            last_reading_date: res.data.current.timestamp,
          }}
        />

        <MeterDetailsCards
          data={{
            consumption: res.data.current.consumption,
            voltage: res.data.current.voltage,
            current: res.data.current.current,
            powerFactor: res.data.current.powerFactor,
            baseline: +res.data.analysis.baseline.toFixed(2),
            variation_percentage:
              +res.data.analysis.variationPercent.toFixed(2),
          }}
        />

        <div className="mt-8 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Historial de lecturas</h2>
          <DataTable columns={meterDetailColumns} data={res.data.history} />
        </div>
      </div>
    </div>
  )
}
