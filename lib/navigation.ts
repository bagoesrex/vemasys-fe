import {
    CalendarCheck, History, ClipboardCheck, BusFront, Fuel,
    Wrench, UserCog, MapPinned, Users,
    LucideIcon,
} from "lucide-react"

export type NavItem = {
    title: string
    url: string
    icon?: LucideIcon
}

export type NavGroup = {
    title: string
    items: NavItem[]
}

export const navByRole: Record<string, NavGroup[]> = {
    admin: [
        {
            title: "Manage Bookings",
            items: [
                { title: "Booking Request", url: "/admin/bookings/request", icon: CalendarCheck },
                { title: "Pending Approvals", url: "/admin/bookings/pending", icon: ClipboardCheck },
                { title: "Booking History", url: "/admin/bookings/history", icon: History },
            ],
        },
        {
            title: "Manage Vehicles",
            items: [
                { title: "Vehicles", url: "/admin/vehicles", icon: BusFront },
                { title: "Fuel Logs", url: "/admin/fuel-logs", icon: Fuel },
                { title: "Service Records", url: "/admin/service-records", icon: Wrench },
            ],
        },
        {
            title: "Others",
            items: [
                { title: "Drivers", url: "/admin/drivers", icon: UserCog },
                { title: "Regions", url: "/admin/regions", icon: MapPinned },
                { title: "Users", url: "/admin/users", icon: Users },
            ],
        },
    ],
    approver_1: [
        {
            title: "Approvals",
            items: [
                { title: "Pending Approvals", url: "/approver-1/approvals", icon: ClipboardCheck },
                { title: "Approval History", url: "/approver-1/history", icon: History },
            ],
        },
    ],
    approver_2: [
        {
            title: "Approvals",
            items: [
                { title: "Pending Approvals", url: "/approver-2/approvals", icon: ClipboardCheck },
                { title: "Approval History", url: "/approver-2/history", icon: History },
            ],
        },
    ],
}
