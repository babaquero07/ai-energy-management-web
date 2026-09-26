import { Metadata } from "next"
import { MetersResponse } from "./types/meters.types"
import { meterColumns } from "./ui/components/meter-columns"
import { DataTable } from "@/components/shared/data-table"
import { DataTablePagination } from "@/components/shared/data-table-pagination"

export const metadata: Metadata = {
  title: "Gestión de medidores",
  description: "Gestión de medidores y dispositivos conectados.",
}

export default async function Page() {
  const { data }: MetersResponse = await fetch(
    "http://localhost:3000/api/meters"
  )
    .then((res) => {
      return res.json()
    })
    .catch((err) => {
      console.error(err)
      return null
    })

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold">Gestión de medidores</h1>
        <p className="text-lg text-muted-foreground">
          Gestión de medidores y dispositivos conectados.
        </p>
      </div>

      <div className="w-full">
        <DataTable columns={meterColumns} data={data} />
      </div>
    </div>
  )
}
