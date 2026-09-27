import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-mobile": "20rem",
          "--sidebar-background": "#0B1120",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <SidebarTrigger className="size-10 shrink-0 cursor-pointer hover:shadow-none" />
        {children}
      </main>
    </SidebarProvider>
  )
}
