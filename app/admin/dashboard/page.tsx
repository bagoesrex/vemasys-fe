'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

const timeRanges = ['Last 3 months', 'Last 30 days', 'Last 7 days']

export default function AdminDashboardPage() {
  const [range, setRange] = useState('Last 3 months')
  const [stats, setStats] = useState([
    { title: 'Total Bookings', value: '-', note: '' },
    { title: 'Pending Approvals', value: '-', note: '' },
    { title: 'Active Vehicles', value: '-', note: '' },
    { title: 'Rejected Bookings', value: '-', note: '' },
  ])
  const [chartData, setChartData] = useState<{ date: string; bookings: number }[]>([])


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [historyRes, pendingRes, vehiclesRes] = await Promise.all([
          api.get('/admin/bookings/history'),
          api.get('/admin/bookings/pending'),
          api.get('/vehicles'),
        ])

        const bookings = historyRes.data || []
        const pending = pendingRes.data || []
        const vehicles = vehiclesRes.data || []

        const rejected = bookings.filter((b: { approvals: any[] }) =>
          b.approvals.some((a: { status: string }) => a.status === 'rejected')
        )

        const activeVehicles = vehicles.filter((v: { status: string }) => v.status === 'available')

        const approvedBookings = bookings.filter((b: { approvals: any[] }) =>
          b.approvals.some((a: { status: string }) => a.status === 'approved')
        )

        setStats([
          {
            title: 'Approved Bookings',
            value: approvedBookings.length.toString(),
            note: 'Total booking disetujui',
          },
          {
            title: 'Pending Approvals',
            value: pending.length.toString(),
            note: 'Menunggu persetujuan',
          },
          {
            title: 'Active Vehicles',
            value: activeVehicles.length.toString(),
            note: 'Status kendaraan aktif',
          },
          {
            title: 'Rejected Bookings',
            value: rejected.length.toString(),
            note: 'Penolakan pemesanan',
          },
        ])

        const grouped = bookings.reduce((acc: { [x: string]: any }, b: { booking_date: string | number | Date }) => {
          const date = new Date(b.booking_date).toLocaleDateString('en-US', {
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
        console.error('Gagal fetch dashboard data', err)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 space-y-6 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader>
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
              <p className="text-xs text-muted-foreground">{stat.note}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Total Bookings</CardTitle>
            <CardDescription>Total for the last 3 months</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((label) => (
              <Button
                key={label}
                variant={range === label ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRange(label)}
              >
                {label}
              </Button>
            ))}
          </div>
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