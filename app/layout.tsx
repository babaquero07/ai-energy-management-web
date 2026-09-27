import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Metadata } from "next"
import { CoreProvider } from "./providers"
import { Toaster } from "@/components/ui/toast"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    template: "%s | AI Energy Management",
    default: "AI Energy Management",
  },
  description:
    "Panel web frontend para monitorear medidores de energía, revisar telemetría y gestionar anomalías detectadas por IA.",
  keywords: [
    "dashboard energético",
    "telemetría",
    "gestión de energía",
    "detección de anomalías",
    "inteligencia artificial",
    "frontend web",
    "smart grid",
    "monitorización eléctrica",
  ],
  authors: [{ name: "Alexander Baquero" }],
  creator: "Alexander Baquero",
  publisher: "AI Energy Management Web",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://ai-energy-management-web.vercel.app",
  },
  openGraph: {
    title: "AI Energy Management Web | Telemetría y Anomalías Energéticas",
    description:
      "Explora este panel frontend diseñado para la monitorización en tiempo real de medidores de energía y la visualización de anomalías mediante servicios de inferencia.",
    url: "https://ai-energy-management-web.vercel.app",
    siteName: "AI Energy Management Web",
    images: [
      {
        url: "https://ai-energy-management-web.vercel.app/images/ai-management-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Interfaz del dashboard mostrando el flujo de telemetría y las alertas de anomalías detectadas por IA",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Energy Management Web | Dashboard Frontend",
    description:
      "Panel web para la monitorización de medidores de energía y gestión de alertas por inteligencia artificial.",
    images: [
      "https://ai-energy-management-web.vercel.app/images/ai-management-meta.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <CoreProvider>{children}</CoreProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
