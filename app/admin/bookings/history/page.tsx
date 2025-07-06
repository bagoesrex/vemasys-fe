'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatID } from '@/lib/date'

interface Booking {
    id: number
    booking_date: string
    start_time: string
    end_time: string
    purpose: string
    user: { name: string }
    driver: { name: string }
    vehicle: { license_plate: string; brand: string }
    approvals: { level: number; status: string; approved_at: string }[]
}

export default function AdminBookingHistoryPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true)
                const res = await api.get('/admin/bookings/history')
                setBookings(res.data)
            } catch (err) {
                console.error('Gagal fetch booking history', err)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Riwayat Booking</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : bookings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada data riwayat booking.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Kendaraan</TableHead>
                                    <TableHead>Keperluan</TableHead>
                                    <TableHead>Status Akhir</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((b) => {
                                    const latestApproval = [...b.approvals].sort(
                                        (a, b2) => b2.level - a.level
                                    )[0]

                                    return (
                                        <TableRow key={b.id}>
                                            <TableCell>{b.id}</TableCell>
                                            <TableCell>{formatID(b.booking_date)}</TableCell>
                                            <TableCell>{b.user?.name}</TableCell>
                                            <TableCell>{b.driver?.name}</TableCell>
                                            <TableCell>
                                                {b.vehicle?.license_plate} - {b.vehicle?.brand}
                                            </TableCell>
                                            <TableCell>{b.purpose}</TableCell>
                                            <TableCell className="capitalize">
                                                {latestApproval?.status ?? 'N/A'} ({latestApproval?.level})
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
