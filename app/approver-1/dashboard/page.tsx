'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useEffect, useState } from 'react'
import api from '@/utils/api'

export default function ApproverDashboardPage() {
  const [stats, setStats] = useState([
    { title: 'Approved Bookings', value: '-', note: '', color: 'text-green-600' },
    { title: 'Pending Approvals', value: '-', note: '', color: 'text-yellow-600' },
    { title: 'Rejected Bookings', value: '-', note: '', color: 'text-red-600' },
  ])
  const [chartData, setChartData] = useState<{ date: string; bookings: number }[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [historyRes, pendingRes] = await Promise.all([
          api.get('/approvals/history'),
          api.get('/approvals'),
        ])

        const history = historyRes.data || []
        const pending = pendingRes.data || []

        const approved = history.filter((item: { status: string }) => item.status === 'approved')
        const rejected = history.filter((item: { status: string }) => item.status === 'rejected')

        setStats([
          {
            title: 'Approved Bookings',
            value: approved.length.toString(),
            note: 'Total disetujui oleh Anda',
            color: 'text-green-600',
          },
          {
            title: 'Pending Approvals',
            value: pending.length.toString(),
            note: 'Menunggu persetujuan Anda',
            color: 'text-yellow-600',
          },
          {
            title: 'Rejected Bookings',
            value: rejected.length.toString(),
            note: 'Ditolak oleh Anda',
            color: 'text-red-600',
          },
        ])

        const grouped = approved.reduce((acc: { [x: string]: number }, b: { created_at: string }) => {
          const date = new Date(b.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})

        const data = Object.entries(grouped).map(([date, bookings]) => ({
          date,
          bookings: Number(bookings),
        }))
        setChartData(data)
      } catch (err) {
        console.error('Gagal fetch approver dashboard data', err)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 space-y-6 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader>
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{stat.note}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approved Bookings</CardTitle>
          <CardDescription>Grafik data booking yang Anda setujui</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
