'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import { format } from 'date-fns'
import api from '@/utils/api'

const formatDatetimeToLaravel = (datetime: string) => {
  const date = new Date(datetime)
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export default function AdminRequestPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    vehicle_id: '',
    user_id: '1',
    region_id: '',
    driver_id: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    purpose: '',
  })

  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [regions, setRegions] = useState<any[]>([])

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        start_time: formatDatetimeToLaravel(form.start_time),
        end_time: formatDatetimeToLaravel(form.end_time),
      }

      await api.post('/admin/bookings/request', payload)
      router.push('/admin/bookings/pending')
    } catch (err: any) {
      console.error(err)
      alert('Gagal mengirim booking: ' + (err.response?.data?.message || err.message))
    }
  }

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [v, d, r] = await Promise.all([
          api.get('/vehicles'),
          api.get('/drivers'),
          api.get('/regions'),
        ])
        setVehicles(v.data)
        setDrivers(d.data)
        setRegions(r.data)
      } catch (error) {
        console.error('Gagal fetch data:', error)
      }
    }

    fetchOptions()
  }, [])

  return (
    <div className="w-full flex justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Form Booking Kendaraan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Vehicle</Label>
                  <Select onValueChange={(val) => handleChange('vehicle_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.license_plate} - {v.brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Region</Label>
                  <Select onValueChange={(val) => handleChange('region_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Driver</Label>
                  <Select onValueChange={(val) => handleChange('driver_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Tanggal Booking</Label>
                  <Input
                    type="date"
                    name="booking_date"
                    value={form.booking_date}
                    onChange={(e) => handleChange('booking_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="datetime-local"
                    name="start_time"
                    value={form.start_time}
                    onChange={(e) => handleChange('start_time', e.target.value)}
                  />
                </div>

                <div>
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    name="end_time"
                    value={form.end_time}
                    onChange={(e) => handleChange('end_time', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Keperluan</Label>
              <Textarea
                name="purpose"
                placeholder="Tulis keperluan penggunaan kendaraan"
                value={form.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Kirim Booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
