"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Sparkles } from "lucide-react"

export default function EmptyAnomalies() {
  const queryClient = useQueryClient()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const executeAnalysis = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${API_URL}/ai/analyze/execute`, {
          method: "POST",
        })

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch"
        throw new Error(message)
      }
    },
    onSuccess: (res: { success: boolean }) => {
      if (!res.success) {
        throw new Error("Failed to execute analysis")
      }

      // refresh page
      queryClient.invalidateQueries({ queryKey: ["anomalies"] })
      toast.add({
        type: "success",
        title: "Análisis ejecutado correctamente",
        description:
          "El análisis se ha ejecutado correctamente. Redirigiendo...",
        timeout: 5000,
      })

      window.location.reload()
    },
    onError: (error: Error) => {
      console.error(error)

      toast.add({
        type: "warning",
        title: "Error al ejecutar el análisis",
        description: error.message || "Por favor, inténtalo de nuevo",
      })
    },
  })

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-3xl font-bold">No hay anomalías detectadas</h1>
      <Separator />

      <Button
        disabled={executeAnalysis.isPending}
        onClick={() => executeAnalysis.mutate()}
        className="max-w-45 cursor-pointer rounded-sm bg-[#10B981] px-6 py-4 font-semibold text-[#0F172A] transition-all duration-300 hover:scale-105 hover:bg-emerald-500 disabled:opacity-50"
      >
        {executeAnalysis.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {executeAnalysis.isPending
          ? "Ejecutando análisis..."
          : "Ejecutar análisis IA"}
      </Button>
    </div>
  )
}
