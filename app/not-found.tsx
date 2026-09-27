import Link from "next/link"
import { ArrowLeft, ZapOff } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-lg flex-col gap-6 rounded-xl bg-[#0B1120] p-8 ring-1 ring-foreground/10">
        <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/10">
          <ZapOff className="size-5 text-emerald-500" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold tracking-wide text-emerald-400">
            Error 404
          </p>
          <h1 className="text-3xl font-bold">Página no encontrada</h1>
          <p className="text-base text-muted-foreground">
            No pudimos encontrar el recurso que buscas. El enlace puede estar
            desactualizado o el medidor ya no existe.
          </p>
        </div>

        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-fit cursor-pointer bg-white text-black hover:bg-white/90"
          )}
        >
          <ArrowLeft />
          Volver al dashboard
        </Link>
      </div>
    </main>
  )
}
