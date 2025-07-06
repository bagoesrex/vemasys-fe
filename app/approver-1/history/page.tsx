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
import { formatID, formatRangeID, formatToLaravel } from '@/lib/date'

interface Approval {
    id: number
    booking_id: number
    level: number
    status: string
    approved_at: string
    booking: {
        purpose: string
        booking_date: string
        start_time: string
        end_time: string
    }
}

export default function ApproverHistoryPage() {
    const [approvals, setApprovals] = useState<Approval[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true)
                const res = await api.get('/approvals/history')
                setApprovals(res.data)
            } catch (err) {
                console.error('Gagal mengambil data history', err)
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
                    <CardTitle className="text-xl font-semibold">
                        Riwayat Persetujuan Booking
                    </CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : approvals.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Belum ada data riwayat approval.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tanggal Booking</TableHead>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Keperluan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Disetujui Pada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvals.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.booking_id}</TableCell>
                                        <TableCell>{formatID(item.booking.booking_date)}</TableCell>
                                        <TableCell>
                                            {formatRangeID(item.booking.start_time, item.booking.end_time)}
                                        </TableCell>
                                        <TableCell>{item.booking.purpose}</TableCell>
                                        <TableCell className="capitalize">
                                            {item.status} (Level {item.level})
                                        </TableCell>
                                        <TableCell>
                                            {formatID(item.approved_at)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
