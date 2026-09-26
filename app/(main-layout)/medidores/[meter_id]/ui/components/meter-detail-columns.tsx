"use client"

import { DataTableFeatures } from "@/components/shared/data-table-features"
import { Current, MeterDetail } from "../../types/meter-detail.types"
import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

const columnHelper = createColumnHelper<DataTableFeatures, Current>()

export const meterDetailColumns = columnHelper.columns([
  columnHelper.accessor("consumption", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Consumo
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-emerald-500">
          {row.original.consumption} kWh
        </span>
      )
    },
  }),
  columnHelper.accessor("voltage", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Voltaje
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-indigo-200">
          {row.original.voltage} V
        </span>
      )
    },
  }),
  columnHelper.accessor("current", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Corriente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-indigo-200">
          {row.original.current} A
        </span>
      )
    },
  }),
  columnHelper.accessor("powerFactor", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Factor de potencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-sky-300">
          {row.original.powerFactor}
        </span>
      )
    },
  }),
  columnHelper.accessor("timestamp", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-muted-foreground">
          {new Date(row.original.timestamp).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      )
    },
  }),
])
