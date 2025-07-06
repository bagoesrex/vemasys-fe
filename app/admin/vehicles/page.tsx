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

interface Vehicle {
    id: number
    license_plate: string
    type: string
    brand: string
    year: number
    status: 'available' | 'booked' | 'in_service'
    is_rented: boolean
    region: { name: string }
    owner?: { name: string }
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true)
                const res = await api.get('/vehicles')
                setVehicles(res.data)
            } catch (err) {
                console.error('Gagal fetch data kendaraan', err)
            } finally {
                setLoading(false)
            }
        }

        fetchVehicles()
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Daftar Kendaraan</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : vehicles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada data kendaraan.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Plat Nomor</TableHead>
                                    <TableHead>Merk</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Tahun</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sewa</TableHead>
                                    <TableHead>Wilayah</TableHead>
                                    <TableHead>Pemilik</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.map((v) => (
                                    <TableRow key={v.id}>
                                        <TableCell>{v.id}</TableCell>
                                        <TableCell>{v.license_plate}</TableCell>
                                        <TableCell>{v.brand}</TableCell>
                                        <TableCell>{v.type}</TableCell>
                                        <TableCell>{v.year}</TableCell>
                                        <TableCell className="capitalize">{v.status.replace('_', ' ')}</TableCell>
                                        <TableCell>{v.is_rented ? 'Ya' : 'Tidak'}</TableCell>
                                        <TableCell>{v.region?.name ?? '-'}</TableCell>
                                        <TableCell>{v.owner?.name ?? '-'}</TableCell>
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
