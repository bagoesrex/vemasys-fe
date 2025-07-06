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

interface FuelLog {
    id: number
    vehicle_id: number
    log_date: string | null
    odometer: number
    fuel_amount: number
    created_at: string | null
    vehicle: {
        license_plate: string
        brand: string
        type: string
    }
}

export default function FuelLogsPage() {
    const [logs, setLogs] = useState<FuelLog[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true)
                const res = await api.get('/fuel-logs')
                setLogs(res.data)
            } catch (err) {
                console.error('Gagal mengambil data fuel logs', err)
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Log Pengisian BBM</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : logs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada data pengisian BBM.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Kendaraan</TableHead>
                                    <TableHead>Odometer</TableHead>
                                    <TableHead>Jumlah BBM (L)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.id}</TableCell>
                                        <TableCell>
                                            {log.log_date ? formatID(log.log_date) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {log.vehicle?.license_plate} - {log.vehicle?.brand} ({log.vehicle?.type})
                                        </TableCell>
                                        <TableCell>{log.odometer.toLocaleString('id-ID')} km</TableCell>
                                        <TableCell>{log.fuel_amount} L</TableCell>
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
