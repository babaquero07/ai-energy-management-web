"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface DialogAnomalyDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function DialogAnomalyDetail({
  open,
  onOpenChange,
  children,
}: DialogAnomalyDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full overflow-y-auto border-slate-800 bg-[#0B1120] p-5 sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
