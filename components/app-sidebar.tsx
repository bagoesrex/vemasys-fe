
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  CalendarCheck,
  History,
  ClipboardCheck,
  BusFront,
  Fuel,
  Wrench,
  UserCog,
  MapPinned,
  Users,
} from "lucide-react";

type NavItem = {
  title: string
  url: string
  isActive?: boolean
  icon?: React.ReactNode
}

type NavGroup = {
  title: string
  url: string
  items: NavItem[]
}

const data: { navMain: NavGroup[] } = {
  navMain: [
    {
      title: "Manage Bookings",
      url: "#",
      items: [
        {
          title: "Booking Request",
          url: "/bookings/request",
          icon: <CalendarCheck className="w-4 h-4 mr-2" />,
        },
        {
          title: "Pending Approvals",
          url: "/bookings/approvals",
          icon: <ClipboardCheck className="w-4 h-4 mr-2" />,
        },
        {
          title: "Booking History",
          url: "/bookings/history",
          icon: <History className="w-4 h-4 mr-2" />,
        },
      ],
    },
    {
      title: "Manage Vehicles",
      url: "#",
      items: [
        {
          title: "Vehicles",
          url: "/vehicles",
          icon: <BusFront className="w-4 h-4 mr-2" />,
        },
        {
          title: "Fuel Logs",
          url: "/vehicles/fuel-logs",
          icon: <Fuel className="w-4 h-4 mr-2" />,
        },
        {
          title: "Service Records",
          url: "/vehicles/services",
          icon: <Wrench className="w-4 h-4 mr-2" />,
        },
      ],
    },
    {
      title: "Others",
      url: "#",
      items: [
        {
          title: "Drivers",
          url: "/drivers",
          icon: <UserCog className="w-4 h-4 mr-2" />,
        },
        {
          title: "Regions",
          url: "/regions",
          icon: <MapPinned className="w-4 h-4 mr-2" />,
        },
        {
          title: "Users",
          url: "/users",
          icon: <Users className="w-4 h-4 mr-2" />,
        },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1>VAMESYS ICON</h1>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((child) => (
                  <SidebarMenuItem key={child.title}>
                    <SidebarMenuButton asChild isActive={child.isActive}>
                      <a href={child.url} className="flex items-center">
                        {child.icon && child.icon}
                        <span>{child.title}</span>
                      </a>
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
