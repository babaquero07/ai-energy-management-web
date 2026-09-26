import { Metadata } from "next"
import { AnomaliesResponse } from "./types/anomalies-types.type"
import EmptyAnomalies from "./ui/components/empty-anomalies"
import { DataTable } from "@/components/shared/data-table"
import { anomaliesColumns } from "./ui/components/anomalies-columns"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Anomalias",
  description: "Anomalias detectadas",
}

export default async function AnomaliesPage() {
  const res: AnomaliesResponse | null = await fetch(
    `http://localhost:3000/api/anomalies`
  )
    .then((res) => res.json())
    .catch((err) => null)

  if (res?.data.length === 0) {
    return <EmptyAnomalies />
  }

  const anomalies = res?.data || []

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Detección de anomalías IA</h1>
        <p className="text-lg text-muted-foreground">
          Eventos detectados por el modelo de inferencia.
        </p>
      </div>
      <Separator />

      <Card className="rounded-lg bg-[#0B1120]">
        <CardContent>
          <DataTable columns={anomaliesColumns} data={anomalies} />
        </CardContent>
      </Card>
    </div>
  )
}
