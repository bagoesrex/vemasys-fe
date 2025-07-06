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

interface Driver {
    id: number
    name: string
    license_number: string
    phone: string
    region: {
        id: number
        name: string
    }
}

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                setLoading(true)
                const res = await api.get('/drivers')
                setDrivers(res.data)
            } catch (err) {
                console.error('Gagal fetch driver data', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDrivers()
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Daftar Driver</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : drivers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada data driver.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>No. SIM</TableHead>
                                    <TableHead>Telepon</TableHead>
                                    <TableHead>Wilayah</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drivers.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell>{d.id}</TableCell>
                                        <TableCell>{d.name}</TableCell>
                                        <TableCell>{d.license_number}</TableCell>
                                        <TableCell>{d.phone}</TableCell>
                                        <TableCell>{d.region?.name ?? '-'}</TableCell>
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
