'use client'

import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Cookies from 'js-cookie'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import api from '@/utils/api'

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await api.post('/logout')
        } catch (error) {
            console.error('Logout gagal', error)
        } finally {
            Cookies.remove('token')
            Cookies.remove('role')
            router.push('/login')
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </header>
                <div className="flex flex-1 flex-col">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
