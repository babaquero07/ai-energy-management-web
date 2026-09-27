# AI Energy Management Web

Panel web para monitorear medidores de energía, revisar telemetría y gestionar anomalías detectadas por un servicio de inferencia. Este repositorio es solo el frontend: no persiste datos ni ejecuta el modelo. Todas las lecturas y acciones se delegan a una API REST externa.

## Tecnologías

| Capa | Tecnología | Uso en el proyecto |
| --- | --- | --- |
| Framework | Next.js 16.3 (App Router) | Rutas, Server Components y metadata |
| UI | React 19 | Componentes de página e interacción |
| Lenguaje | TypeScript 5 (`strict`) | Tipado de respuestas de la API y props |
| Estilos | Tailwind CSS 4 + PostCSS | Layout, tema oscuro y utilidades |
| Componentes | shadcn/ui (`base-nova`) sobre `@base-ui/react` | Sidebar, tablas, diálogos, formularios |
| Iconos | lucide-react | Navegación y acciones |
| Datos en cliente | TanStack Query 5 | Consultas y mutaciones del navegador |
| Tablas | TanStack Table 9 | Orden, paginación y columnas |
| Gráficas | Recharts 3 | Demanda del medidor y segmento de anomalía |
| Fechas | date-fns + react-day-picker | Filtro de fecha y ejes de gráficas |
| Tema | next-themes | Tema oscuro por defecto (`class` en `<html>`) |
| Fuentes | Geist y Geist Mono (`next/font`) | Tipografía del layout raíz |
| Calidad | ESLint 9 (`eslint-config-next`) y Prettier 3 | Lint y formato |

Gestor de paquetes: **pnpm** (`pnpm-lock.yaml`). El alias `@/*` apunta a la raíz del repositorio (`tsconfig.json`).

## Arquitectura

El navegador habla con Next.js. Las páginas del App Router piden datos en el servidor con `fetch` y `process.env.API_URL`. Las interacciones (analizar, eliminar, ver detalle) ocurren en Client Components y usan `process.env.NEXT_PUBLIC_API_URL`, porque esa variable sí se incluye en el bundle del navegador.

```text
Navegador
  └── Next.js (puerto 3001)
        ├── Server Components  →  API_URL              (no se expone al cliente)
        └── Client Components  →  NEXT_PUBLIC_API_URL  (visible en el navegador)
                                      └── API REST (puerto 3000, /api)
```

No hay Route Handlers, Server Actions ni base de datos en este repo. TanStack Query cubre el estado asíncrono del cliente; el listado de páginas se refresca con `router.refresh()` o recarga completa después de una mutación.

### Layouts

- `app/layout.tsx`: HTML, fuentes, `ThemeProvider`, `QueryClientProvider` (`app/providers.tsx`) y toasts.
- `app/(main-layout)/layout.tsx`: sidebar y contenido. El grupo `(main-layout)` no aparece en la URL.

### Rutas

| Ruta | Archivo | Qué muestra |
| --- | --- | --- |
| `/` | `app/(main-layout)/page.tsx` | Resumen operativo y KPIs |
| `/medidores` | `app/(main-layout)/medidores/page.tsx` | Inventario, conteos y filtros por query string |
| `/medidores/[meter_id]` | `app/(main-layout)/medidores/[meter_id]/page.tsx` | Lectura actual, gráfica, historial y análisis puntual |
| `/anomalias` | `app/(main-layout)/anomalias/page.tsx` | Tabla de anomalías, o estado vacío con ejecución del análisis |

`app/not-found.tsx` cubre el 404 (también cuando un medidor no existe). `app/error.tsx` cubre fallos no capturados del árbol de React. El detalle de un medidor tiene `loading.tsx` mientras resuelve la página.

### Estructura de carpetas

```text
app/
  layout.tsx                 # raíz: tema, query client, toasts
  providers.tsx
  error.tsx
  not-found.tsx
  globals.css
  (main-layout)/
    layout.tsx               # sidebar
    page.tsx                 # dashboard
    types/
    ui/components/           # KPIs
    medidores/
      page.tsx
      types/
      ui/components/         # filtros, columnas, tarjetas
      [meter_id]/
        page.tsx
        loading.tsx
        types/
        ui/components/       # gráfica, análisis IA, historial
    anomalias/
      page.tsx
      types/
      ui/components/         # detalle, badges, métricas, gráfico
components/
  app-sidebar.tsx
  theme-provider.tsx
  shared/                    # DataTable, paginación, confirmación
  ui/                        # primitivos shadcn
hooks/use-mobile.ts
lib/utils.ts                 # reexporta `cn`
```

Cada módulo de dominio (`medidores`, `anomalias`, dashboard) guarda sus tipos junto a la ruta y los componentes de UI en `ui/components`. Los primitivos reutilizables viven en `components/`.

### Server Components y Client Components

Las páginas son Server Components: leen `searchParams` o `params` (ambos son `Promise` en esta versión de Next.js), llaman a la API y pasan datos serializables a los hijos.

Son Client Components (`"use client"`) cuando necesitan estado, eventos o hooks:

- Filtros de medidores (`useSearchParams`, debounce de 800 ms sobre `meter_id`).
- Tablas (`DataTable`) y columnas con menús.
- Análisis de un medidor, ejecución global del análisis, detalle y borrado de anomalías (TanStack Query).
- Gráfica de demanda (Recharts) y sidebar (ruta activa).

## Contrato con la API

Base local: `http://localhost:3000/api`.

### Lecturas (servidor, `API_URL`)

| Método | Ruta | Consumidor | Respuesta relevante |
| --- | --- | --- | --- |
| `GET` | `/dashboard/summary` | Dashboard | `{ data: { meters, totalConsumption, anomalies, highPriorityAnomalies, aiConfidence, lastAnalysisAt, lastAnalysisStatus } }` |
| `GET` | `/meters` | Listado | `{ data: { meters, actives, inactives, maintenances, total } }` |
| `GET` | `/meters/:meter_id` | Detalle | `{ data: { meter_id, name, location, status, created_at, current, analysis, history } }` |
| `GET` | `/anomalies` | Listado | `{ data: Anomaly[], total }` |

Query params de `/meters`:

| Parámetro | Origen en la UI | Formato |
| --- | --- | --- |
| `meter_id` | Búsqueda con debounce | Texto, p. ej. `M-101` |
| `status` | Select | `Activo`, `Inactivo` o `Mantenimiento` |
| `date` | Calendario | `YYYY-MM-DD` |

Si el listado falla, la página muestra conteos en cero y una tabla vacía. Si el detalle de un medidor no trae `data`, la ruta responde 404.

### Acciones (navegador, `NEXT_PUBLIC_API_URL`)

| Método | Ruta | Cuándo | Cuerpo / efecto |
| --- | --- | --- | --- |
| `POST` | `/ai/analyze` | Botón “Analizar datos” en el detalle del medidor | `{ meter_id }`. Respuesta `{ detected, anomaly }` |
| `POST` | `/ai/analyze/execute` | “Ejecutar análisis IA” cuando no hay anomalías | Sin cuerpo. Espera `{ success: boolean }` y recarga la página |
| `GET` | `/anomalies/:id` | Diálogo de detalle | `AnomalyDetailResponse` (motivo, acción recomendada, señales, segmento) |
| `PATCH` | `/ai/analysis/:id` | “Analizar datos con IA” si el estado es `DETECTED` | Sin cuerpo. Luego invalida la query del detalle |
| `DELETE` | `/anomalies/:id` | Confirmar eliminación | Refresca la ruta con `router.refresh()` |

Estados de dominio usados en la UI:

- Tipo: `REAL_ANOMALY`, `EXPLAINABLE_ANOMALY`, `FALSE_POSITIVE`, `DATA_QUALITY`, `PENDING_ANALYSIS`.
- Severidad: `LOW`, `MEDIUM`, `HIGH`, `PENDING`.
- Estado: `ANALYZING`, `COMPLETED`, `FAILED`, `RESOLVED`, `DETECTED`.

Señales de inferencia en el detalle: pico de consumo, cambio de baseline, valores atípicos, patrón horario, falla de sensor y relación eléctrica.

## Variables de entorno

Crear un archivo `.env` en la raíz (está ignorado por git). Ambas variables deben apuntar al mismo origen de la API.

```env
API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

| Variable | Dónde se lee | Por qué existen dos |
| --- | --- | --- |
| `API_URL` | Server Components (`page.tsx` del dashboard, medidores y anomalías) | Queda solo en el proceso de Node |
| `NEXT_PUBLIC_API_URL` | Client Components de análisis, detalle y borrado | Next.js la incrusta en el JavaScript del navegador |

En producción, sustituir `localhost:3000` por la URL pública de la API. Un cambio en `NEXT_PUBLIC_*` exige volver a construir (`pnpm build`), porque el valor queda compilado en el cliente.

No hay autenticación, cookies ni secretos en este frontend.

## Despliegue local

Requisitos: Node.js 20 o superior, pnpm y la API escuchando en el puerto 3000.

```bash
pnpm install
```

Crear `.env` con las dos variables de la sección anterior y arrancar el servidor de desarrollo. Next.js queda en el puerto **3001** para no chocar con la API en el 3000:

```bash
pnpm dev
```

Abrir [http://localhost:3001](http://localhost:3001).

Otros scripts:

| Script | Comando | Qué hace |
| --- | --- | --- |
| Producción local | `pnpm build` y luego `pnpm start` | Compila y sirve el build de Next.js |
| Tipos | `pnpm typecheck` | `tsc --noEmit` |
| Lint | `pnpm lint` | ESLint con la config de Next.js |
| Formato | `pnpm format` | Prettier sobre `**/*.{ts,tsx}` |

Prettier usa comillas dobles, sin punto y coma, ancho 80 y el plugin de Tailwind (`app/globals.css`).

## Flujos de usuario

1. **Dashboard.** Al entrar se pide el resumen. La tarjeta superior muestra la fecha del último análisis y el conteo de anomalías, con enlace a `/anomalias`. Los KPIs cubren medidores, consumo, anomalías, alta prioridad y confianza del modelo. “Actualizar” recarga `/`.
2. **Medidores.** Los filtros escriben la query string y el Server Component vuelve a pedir `GET /meters`. Desde el menú de fila se abre `/medidores/[meter_id]`.
3. **Detalle de medidor.** Muestra ubicación, última lectura (consumo, voltaje, corriente, factor de potencia), baseline, variación, gráfica de demanda (semana o día; consumo o variables eléctricas) e historial. “Analizar datos” hace `POST /ai/analyze` y avisa con un toast si hubo detección.
4. **Anomalías.** Con resultados, la tabla ordena por columna. El menú permite ver el detalle, ir al medidor o eliminar. Sin resultados, la pantalla vacía ofrece `POST /ai/analyze/execute`. En el detalle, si el estado es `DETECTED`, se puede lanzar `PATCH /ai/analysis/:id`.
