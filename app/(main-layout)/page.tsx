import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Gauge, RefreshCw } from "lucide-react"
import { DashboardSummaryRes } from "./types/dashboard.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { KpiCards } from "./ui/components/kpi-cards"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard de Operaciones",
  description:
    "Monitoreo y telemetría de eficiencia energética en tiempo real.",
}

export default async function Page() {
  const { data }: DashboardSummaryRes = await fetch(
    "http://localhost:3000/api/dashboard/summary"
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
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold">Dashboard de Operaciones</h1>
          <p className="text-lg text-muted-foreground">
            Monitoreo y telemetría de eficiencia energética en tiempo real.
          </p>
        </div>

        <Button
          size="lg"
          className="cursor-pointer rounded-lg bg-white px-4 text-black hover:bg-white/90"
        >
          <RefreshCw className="size-4" /> <a href="/">Actualizar</a>
        </Button>
      </div>

      <Card className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 py-6 shadow-none">
        <CardContent className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-lg bg-yellow-500/10">
            <Brain className="size-5.5 text-yellow-500" />
          </div>

          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-sm border border-yellow-400/30 bg-yellow-400/15 p-3 text-yellow-400"
                >
                  DETECTED
                </Badge>
                <span className="text-muted-foreground">
                  último análisis:{" "}
                  {new Date(data.lastAnalysisAt).toLocaleString()}
                </span>
              </div>

              <p className="text-lg text-white">
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
              className="flex items-center gap-2 font-bold text-yellow-400 transition-all duration-300 hover:text-yellow-400/80"
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
