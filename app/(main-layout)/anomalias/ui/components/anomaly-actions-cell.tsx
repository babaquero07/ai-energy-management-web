"use client"

import { useState } from "react"
import { Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Anomaly } from "../../types/anomalies-types.type"
import { DialogAnomalyDetail } from "./dialog-anomaly-detail"
import AnomalyDetail from "./anomaly-detail"

export function AnomalyActionsCell({ anomaly }: { anomaly: Anomaly }) {
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <>
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
              className="cursor-pointer"
              onClick={() => setDetailOpen(true)}
            >
              <Eye className="size-3.5" />
              Ver detalle
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogAnomalyDetail open={detailOpen} onOpenChange={setDetailOpen}>
        <AnomalyDetail anomaly_id={anomaly.id} />
      </DialogAnomalyDetail>
    </>
  )
}
