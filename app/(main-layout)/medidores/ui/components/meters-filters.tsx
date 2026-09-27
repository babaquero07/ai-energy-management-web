"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDownIcon, FilterXIcon, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Status } from "../../types/meters.types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { es } from "date-fns/locale"

const STATUS_ALL = "Todos"

export function MetersFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const meterIdParam = searchParams.get("meter_id") ?? ""
  const statusParam = searchParams.get("status") ?? STATUS_ALL
  const dateParam = searchParams.get("date") ?? ""

  const [meterId, setMeterId] = useState(meterIdParam)
  const [syncedMeterId, setSyncedMeterId] = useState(meterIdParam)

  if (meterIdParam !== syncedMeterId) {
    setSyncedMeterId(meterIdParam)
    setMeterId(meterIdParam)
  }

  useEffect(() => {
    const next = meterId.trim()
    if (next === meterIdParam) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (next) {
        params.set("meter_id", next)
      } else {
        params.delete("meter_id")
      }

      const query = params.toString()

      router.replace(query ? `${pathname}?${query}` : pathname)
    }, 800) // Manual debounce time para evitar peticiones excesivas al servidor

    return () => clearTimeout(timeout)
  }, [meterId, meterIdParam, pathname, router, searchParams])

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="my-4 flex flex-col gap-4 sm:my-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex w-full min-w-0 flex-col gap-1.5 lg:max-w-xs lg:flex-1">
        <label htmlFor="meter_id" className="text-sm font-medium">
          Buscar por ID
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="meter_id"
            type="search"
            placeholder="Ej. M-101"
            value={meterId}
            onChange={(event) => setMeterId(event.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:items-end">
        <div className="flex w-full flex-col gap-1.5 lg:w-48">
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <Select
            value={statusParam}
            onValueChange={(value) => {
              if (value == null) return
              updateParams({
                status: value === STATUS_ALL ? null : String(value),
              })
            }}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B1120]">
              <SelectItem value={STATUS_ALL}>Todos</SelectItem>
              {Object.values(Status).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-1.5 lg:w-48">
          <label htmlFor="date" className="text-sm font-medium">
            Fecha creación
          </label>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant={"outline"}
                  data-empty={!dateParam}
                  className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground lg:w-45"
                >
                  {" "}
                  {dateParam ? (
                    new Date(dateParam).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
              }
            />
            <PopoverContent className="w-auto bg-[#0B1120] p-0" align="start">
              <Calendar
                id="date"
                mode="single"
                selected={dateParam ? new Date(dateParam) : undefined}
                onSelect={(e) =>
                  // must be yyyy-mm-dd
                  updateParams({
                    date: e ? new Date(e).toISOString().split("T")[0] : null,
                  })
                }
                defaultMonth={dateParam ? new Date(dateParam) : undefined}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          size="sm"
          className="w-full cursor-pointer rounded-lg bg-white px-4 py-4 text-black hover:bg-white/90 sm:col-span-2 lg:w-auto"
          onClick={() => {
            router.replace(pathname)
          }}
        >
          <FilterXIcon className="size-4" />
          <span className="text-sm">Limpiar</span>
        </Button>
      </div>
    </div>
  )
}
