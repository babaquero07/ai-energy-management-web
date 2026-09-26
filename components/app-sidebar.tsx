"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, ChartLine, Gauge, type LucideIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems: {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: ChartLine,
  },
  {
    title: "Gestión de Medidores",
    href: "/medidores",
    icon: Gauge,
  },
  {
    title: "Anomalías",
    href: "/anomalias",
    icon: Brain,
    badge: "AUTO",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="pointer-events-none text-lg font-semibold"
            >
              AI Energy Management
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                    className="py-5 hover:bg-[#1E293B] hover:text-violet-200 data-active:bg-[#1E293B] data-active:text-chart-1"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge className="mt-1 mr-2 rounded bg-violet-200 px-1.5 text-[10px] font-semibold tracking-wide">
                      {item.badge}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
