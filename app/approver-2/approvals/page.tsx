'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatID, formatRangeID } from '@/lib/date'

interface Approval {
  id: number
  booking_id: number
  level: number
  status: string
  booking: {
    id: number
    purpose: string
    booking_date: string
    start_time: string
    end_time: string
  }
}

export default function ApproverApprovalPage() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(false)

  const fetchApprovals = async () => {
    try {
      setLoading(true)
      const res = await api.get('/approvals')
      setApprovals(res.data)
    } catch (err) {
      console.error('Gagal mengambil data approvals', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/approvals/${id}/${action}`)
      alert(`Berhasil ${action === 'approve' ? 'menyetujui' : 'menolak'} booking`)
      fetchApprovals()
    } catch (err) {
      console.error(err)
      alert('Gagal memproses aksi')
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-6">Daftar Booking Menunggu Persetujuan</h1>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="space-y-1 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && approvals.length === 0 && (
        <p className="text-muted-foreground text-sm">Tidak ada booking yang menunggu approval.</p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvals.map((approval) => (
            <Card key={approval.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Booking ID: #{approval.booking_id}
                </CardTitle>
                <CardDescription>
                  Level: {approval.level} | Status:{' '}
                  <span className="capitalize">{approval.status}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Tujuan:</span> {approval.booking.purpose}
                </p>
                <p>
                  <span className="font-medium">Tanggal:</span>{' '}
                  {formatID(approval.booking.booking_date)}
                </p>
                <p>
                  <span className="font-medium">Waktu:</span>{' '}
                  {formatRangeID(approval.booking.start_time, approval.booking.end_time)}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => handleAction(approval.id, 'reject')}>
                  Tolak
                </Button>
                <Button onClick={() => handleAction(approval.id, 'approve')}>Setujui</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
