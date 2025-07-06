"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { navByRole } from "@/lib/navigation"
import Link from "next/link"

export function AppSidebar({ ...props }) {
  const role = Cookies.get("role") || "guest"
  const navData = navByRole[role] || []

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1>VAMESYS ICON</h1>
      </SidebarHeader>
      <SidebarContent>
        {navData.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center">
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
