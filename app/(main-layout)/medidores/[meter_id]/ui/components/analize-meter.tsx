"use client"

import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { Anomaly } from "@/app/(main-layout)/anomalias/types/anomalies-types.type"
import { useRouter } from "next/navigation"

interface AnalyzeMeterProps {
  meter_id: string
}

interface AnalyzeMeterResponse {
  detected: boolean
  anomaly: Anomaly | null
}

export function AnalyzeMeter({ meter_id }: AnalyzeMeterProps) {
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const analyzeDataMutation = useMutation<AnalyzeMeterResponse, Error, string>({
    mutationKey: ["analyze-meter"],
    mutationFn: async (meter_id: string): Promise<AnalyzeMeterResponse> => {
      const res = await fetch(`${API_URL}/ai/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meter_id }),
      })

      if (!res.ok) {
        throw new Error("Failed to analyze data")
      }

      return res.json()
    },
    onSuccess: (res: AnalyzeMeterResponse) => {
      if (res.detected) {
        toast.add({
          type: "info",
          title: "Anomalia detectada",
          description: "Se ha detectado una anomalia en el medidor",
          timeout: 10000,
          actionProps: {
            children: "Ver anomalias",
            onClick: () => router.push("/anomalias"),
          },
        })
      } else {
        toast.add({
          type: "success",
          title: "Datos analizados correctamente",
          description: "Ninguna anomalia detectada.",
          timeout: 5000,
        })
      }
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Error al analizar los datos",
        description:
          "Ha ocurrido un error al analizar los datos. Intenta nuevamente.",
        timeout: 5000,
      })
    },
  })

  return (
    <Button
      size="lg"
      onClick={() => analyzeDataMutation.mutate(meter_id)}
      disabled={analyzeDataMutation.isPending}
      className="min-w-52.5 cursor-pointer border-none bg-[#10B981] text-lg text-white transition-all duration-300 hover:scale-105 hover:bg-emerald-500"
    >
      {analyzeDataMutation.isPending ? (
        <Loader2 className="size-4 animate-spin text-white" />
      ) : (
        <Sparkles className="size-5" />
      )}
      {analyzeDataMutation.isPending ? "Analizando..." : "Analizar datos"}
    </Button>
  )
}
