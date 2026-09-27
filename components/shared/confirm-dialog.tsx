"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full overflow-y-auto border-slate-800 bg-[#0B1120] p-5 sm:max-w-xl">
        <DialogTitle>Confirmar</DialogTitle>
        <DialogDescription>
          ¿Estás seguro de querer eliminar este registro?
        </DialogDescription>
        <DialogFooter className="bg-[#0B1120]">
          <DialogClose
            render={
              <Button variant="outline" className="cursor-pointer">
                Cancelar
              </Button>
            }
          />
          <DialogClose
            render={
              <Button
                variant="destructive"
                onClick={onConfirm}
                className="cursor-pointer"
              >
                Eliminar
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
