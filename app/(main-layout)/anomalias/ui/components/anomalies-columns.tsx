"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Anomaly, AnomalySeverity } from "../../types/anomalies-types.type"
import { DataTableFeatures } from "@/components/shared/data-table-features"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { AnomalyTypeBadge } from "./anomaly-type-badge"
import { AnomalyActionsCell } from "./anomaly-actions-cell"

const columnHelper = createColumnHelper<DataTableFeatures, Anomaly>()

const severityColors: Record<AnomalySeverity, string> = {
  [AnomalySeverity.LOW]: "text-green-500",
  [AnomalySeverity.MEDIUM]: "text-yellow-500",
  [AnomalySeverity.HIGH]: "text-red-500",
  [AnomalySeverity.PENDING]: "text-gray-500",
}

export const anomaliesColumns = columnHelper.columns([
  columnHelper.accessor("meter_id", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID Medidor
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-white">{row.original.meter_id}</span>
      )
    },
  }),
  columnHelper.accessor("type", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <AnomalyTypeBadge type={row.original.type} />
    },
  }),
  columnHelper.accessor("severity", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Severidad
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span
          className={cn(
            "text-base text-white",
            severityColors[row.original.severity]
          )}
        >
          {row.original.severity}
        </span>
      )
    },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="text-base text-white">{row.original.status}</span>
    },
  }),
  columnHelper.accessor("confidence", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Confianza
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-white">
          {row.original.confidence * 100} %
        </span>
      )
    },
  }),
  columnHelper.accessor("detected_at", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer text-base"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-base text-white">
          {new Date(row.original.detected_at).toLocaleDateString("es-CO", {
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
    cell: ({ row }) => <AnomalyActionsCell anomaly={row.original} />,
  }),
])
