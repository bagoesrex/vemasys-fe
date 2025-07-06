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

interface VehicleService {
    id: number
    service_date: string | null
    description: string
    cost: number
    vehicle: {
        license_plate: string
        brand: string
        type: string
    }
}

export default function VehicleServicesPage() {
    const [services, setServices] = useState<VehicleService[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true)
                const res = await api.get('/vehicle-services')
                setServices(res.data)
            } catch (err) {
                console.error('Gagal mengambil data service kendaraan', err)
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Riwayat Servis Kendaraan</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : services.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada data servis kendaraan.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tanggal Servis</TableHead>
                                    <TableHead>Kendaraan</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Biaya</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.id}</TableCell>
                                        <TableCell>{s.service_date ? formatID(s.service_date) : '-'}</TableCell>
                                        <TableCell>
                                            {s.vehicle?.license_plate} - {s.vehicle?.brand} ({s.vehicle?.type})
                                        </TableCell>
                                        <TableCell>{s.description}</TableCell>
                                        <TableCell>
                                            Rp {s.cost.toLocaleString('id-ID')}
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
