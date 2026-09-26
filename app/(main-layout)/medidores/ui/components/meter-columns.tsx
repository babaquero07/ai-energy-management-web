"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "@/components/shared/data-table-features"
import { Meter } from "../../types/meters.types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

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
  columnHelper.display({
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const meter = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="h-8 w-8 p-0" />}
          >
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-45">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(meter.meter_id.toString())
                }
              >
                Copiar ID del medidor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
              <DropdownMenuItem>
                <Link href={`/medidores/${meter.meter_id}`}>Ver detalles</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
])
