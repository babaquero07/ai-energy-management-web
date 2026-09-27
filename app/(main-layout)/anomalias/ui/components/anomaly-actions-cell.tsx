"use client"

import { useState } from "react"
import { Eye, LinkIcon, MoreHorizontal, Trash } from "lucide-react"
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
import Link from "next/link"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-dialog"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

export function AnomalyActionsCell({ anomaly }: { anomaly: Anomaly }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const deleteMutation = useMutation({
    mutationKey: ["delete-anomaly"],
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/anomalies/${anomaly.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete anomaly")
      }

      return res.json()
    },
    onSuccess: () => {
      toast.add({
        title: "Anomalia eliminada",
        description: "La anomalia ha sido eliminada correctamente",
        timeout: 5000,
      })

      router.refresh()
    },
    onError: () => {
      toast.add({
        title: "Error",
        description: "Error al eliminar la anomalia",
        timeout: 5000,
      })
    },
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-8 w-8 p-0" />}
        >
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-45 bg-[#0B1120]">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setDetailOpen(true)}
            >
              <Eye className="mr-2 size-3.5" />
              Ver detalle
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
              <LinkIcon className="mr-2 size-3.5" />
              <Link href={`/medidores/${anomaly.meter_id}`}>Ver medidor</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer bg-red-400/60 focus:bg-red-400/80"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash className="mr-2 size-3.5" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogAnomalyDetail open={detailOpen} onOpenChange={setDetailOpen}>
        <AnomalyDetail anomaly_id={anomaly.id} />
      </DialogAnomalyDetail>
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  )
}
