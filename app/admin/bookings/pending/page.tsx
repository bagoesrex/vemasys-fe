'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatID, formatRangeID } from '@/lib/date'

interface Approval {
    id: number
    booking_id: number
    level: number
    status: string
}

interface Booking {
    id: number
    purpose: string
    booking_date: string
    start_time: string
    end_time: string
    approvals: Approval[]
}

export default function ApproverApprovalTablePage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                setLoading(true)
                const res = await api.get('/admin/bookings/pending')
                setBookings(res.data)
            } catch (err) {
                console.error('Gagal mengambil data approvals', err)
            } finally {
                setLoading(false)
            }
        }

        fetchApprovals()
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Daftar Booking Pending Approval
                    </CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : bookings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Tidak ada booking yang menunggu approval.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Tujuan</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking) =>
                                    booking.approvals.map((approval) => (
                                        <TableRow key={`${booking.id}-${approval.id}`}>
                                            <TableCell>{booking.id}</TableCell>
                                            <TableCell>{booking.purpose}</TableCell>
                                            <TableCell>{formatID(booking.booking_date)}</TableCell>
                                            <TableCell>
                                                {formatRangeID(booking.start_time, booking.end_time)}
                                            </TableCell>
                                            <TableCell>{approval.level}</TableCell>
                                            <TableCell className="capitalize">
                                                {approval.status}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
