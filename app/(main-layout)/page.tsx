import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, RefreshCw } from "lucide-react"
import { DashboardSummaryRes } from "./types/dashboard.types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { KpiCards } from "./ui/components/kpi-cards"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard de Operaciones",
  description:
    "Monitoreo y telemetría de eficiencia energética en tiempo real.",
}

export const dynamic = "force-dynamic"

export default async function Page() {
  const API_URL = process.env.API_URL

  const { data }: DashboardSummaryRes = await fetch(
    `${API_URL}/dashboard/summary`
  )
    .then((res) => {
      return res.json()
    })
    .catch((err) => {
      console.error(err)
      return null
    })

  return (
    <div className="flex flex-col gap-10 p-8">
      <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-4xl font-extrabold">Dashboard de Operaciones</h1>
          <p className="text-lg text-muted-foreground">
            Monitoreo y telemetría de eficiencia energética en tiempo real.
          </p>
        </div>

        <Button
          size="lg"
          className="cursor-pointer rounded-lg bg-white px-4 text-black hover:bg-white/90"
        >
          <RefreshCw className="size-4" /> <Link href="/">Actualizar</Link>
        </Button>
      </div>

      <Card className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 py-6 shadow-none">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 sm:mx-0">
            <Brain className="size-5.5 text-yellow-500" />
          </div>

          <div className="flex w-full flex-col items-center gap-4 border-0 sm:items-start sm:gap-2 lg:flex-row lg:justify-between lg:gap-8">
            <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Badge
                  variant="secondary"
                  className="rounded-sm border border-yellow-400/30 bg-yellow-400/15 p-3 text-yellow-400"
                >
                  DETECTED
                </Badge>
                <span className="text-sm text-muted-foreground sm:ml-2">
                  Último análisis:{" "}
                  {new Date(data.lastAnalysisAt).toLocaleString()}
                </span>
              </div>

              <p className="mt-2 text-lg text-white sm:mt-0">
                Se identificaron{" "}
                <span className="text-yellow-400">
                  {data.anomalies} anomalías
                </span>{" "}
                en el sistema
                {data.highPriorityAnomalies > 0 && (
                  <span className="text-md text-red-500">
                    {" "}
                    ( {data.highPriorityAnomalies} con alta prioridad )
                  </span>
                )}
                .
              </p>
            </div>

            <Link
              href="/anomalias"
              className="mt-4 flex items-center gap-2 font-bold text-yellow-400 transition-all duration-300 hover:text-yellow-400/80 sm:mt-0"
            >
              Ver diagnóstico <ArrowRight className="size-4 text-yellow-400" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <KpiCards data={data} />
    </div>
  )
}
