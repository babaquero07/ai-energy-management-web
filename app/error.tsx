"use client"

import { RefreshCcw, ZapOff } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { useEffect } from "react"

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-lg flex-col gap-6 rounded-xl bg-[#0B1120] p-8 ring-1 ring-foreground/10">
        <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/10">
          <ZapOff className="size-5 text-emerald-500" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold tracking-wide text-emerald-400">
            Error 500
          </p>
          <h1 className="text-3xl font-bold">Algo salió mal</h1>
          <p className="text-base text-muted-foreground">
            Ocurrió un error al cargar la página. Por favor, intenta nuevamente.
            Si el problema persiste, contacta al soporte.
          </p>
        </div>

        <Button
          onClick={retry}
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-fit cursor-pointer bg-white text-black hover:bg-white/90"
          )}
        >
          <RefreshCcw />
          Intentar nuevamente
        </Button>
      </div>
    </main>
  )
}
