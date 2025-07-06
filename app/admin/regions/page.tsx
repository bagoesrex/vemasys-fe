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

interface Region {
    id: number
    name: string
    address: string
}

export default function RegionsPage() {
    const [regions, setRegions] = useState<Region[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                setLoading(true)
                const res = await api.get('/regions')
                setRegions(res.data)
            } catch (err) {
                console.error('Gagal fetch data regions', err)
            } finally {
                setLoading(false)
            }
        }

        fetchRegions()
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Daftar Wilayah</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded" />
                            ))}
                        </div>
                    ) : regions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada data wilayah.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nama Wilayah</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {regions.map((region) => (
                                    <TableRow key={region.id}>
                                        <TableCell>{region.id}</TableCell>
                                        <TableCell>{region.name}</TableCell>
                                        <TableCell>{region.address ?? '-'}</TableCell>
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
