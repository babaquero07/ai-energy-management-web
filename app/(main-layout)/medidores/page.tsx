import { Metadata } from "next"
import { Suspense } from "react"
import { DataTable } from "@/components/shared/data-table"
import { MetersResponse } from "./types/meters.types"
import { meterColumns } from "./ui/components/meter-columns"
import { MetersFilters } from "./ui/components/meters-filters"
import { GeneralInfoMeterCards } from "./ui/components/general-info-meter-cards"

export const metadata: Metadata = {
  title: "Gestión de medidores",
  description: "Gestión de medidores y dispositivos conectados.",
}

type MetersSearchParams = {
  meter_id?: string
  status?: string
  date?: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<MetersSearchParams>
}) {
  const { meter_id, status, date } = await searchParams

  const query = new URLSearchParams()
  if (meter_id) query.set("meter_id", meter_id)
  if (status) query.set("status", status)
  if (date) query.set("date", date)

  const queryString = query.toString()
  const url = queryString
    ? `http://localhost:3000/api/meters?${queryString}`
    : "http://localhost:3000/api/meters"

  const response: MetersResponse | null = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err)
      return null
    })

  const data = response?.data ?? {
    meters: [],
    actives: 0,
    inactives: 0,
    maintenances: 0,
    total: 0,
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold">Gestión de medidores</h1>
        <p className="text-lg text-muted-foreground">
          Gestión de medidores y dispositivos conectados.
        </p>
      </div>

      <GeneralInfoMeterCards
        data={{
          actives: data.actives,
          inactives: data.inactives,
          maintenances: data.maintenances,
          total: data.total,
        }}
      />

      <div className="flex w-full flex-col gap-4">
        <Suspense
          fallback={<div className="h-16 animate-pulse rounded-lg bg-muted" />}
        >
          <MetersFilters />
        </Suspense>

        <DataTable columns={meterColumns} data={data.meters} />
      </div>
    </div>
  )
}
