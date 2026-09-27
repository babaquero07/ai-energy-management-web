import { Metadata } from "next"
import { Suspense } from "react"
import { DataTable } from "@/components/shared/data-table"
import { MetersResponse } from "./types/meters.types"
import { meterColumns } from "./ui/components/meter-columns"
import { MetersFilters } from "./ui/components/meters-filters"
import { GeneralInfoMeterCards } from "./ui/components/general-info-meter-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Gestión de medidores",
  description: "Gestión de medidores y dispositivos conectados.",
}

export const dynamic = "force-dynamic"

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

  const API_URL = process.env.API_URL

  const queryString = query.toString()
  const url = queryString
    ? `${API_URL}/meters?${queryString}`
    : `${API_URL}/meters`

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
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
          Gestión de medidores
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
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
        <Card className="rounded-lg border border-accent/90 bg-[#0B1120]">
          <CardHeader>
            <CardTitle className="border-b pb-3 text-lg font-bold">
              Lista de medidores
            </CardTitle>
          </CardHeader>
          <CardContent className="min-w-0">
            <Suspense
              fallback={
                <div className="h-16 animate-pulse rounded-lg bg-muted" />
              }
            >
              <MetersFilters />
              <DataTable columns={meterColumns} data={data.meters} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
