"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "@/components/shared/data-table-features"
import { Meter } from "../../types/meters.types"

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Meter>()

export const meterColumns = columnHelper.columns([
  columnHelper.accessor("meter_id", {
    header: "ID medidor",
  }),
  columnHelper.accessor("name", {
    header: "Nombre",
  }),
  columnHelper.accessor("location", {
    header: "Ubicación",
  }),
  columnHelper.accessor("status", {
    header: "Estado",
  }),
  columnHelper.accessor("created_at", {
    header: "Fecha de creación",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      )
    },
  }),
])
