'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBooking } from '@/lib/booking'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AdminRequestPage() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        vehicle_id: '',
        driver_id: '',
        region_id: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        purpose: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await createBooking(formData)
            router.push('/admin/booking/pending')
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to submit booking')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center">Booking Request</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="vehicle_id">Vehicle ID</Label>
                            <Input
                                id="vehicle_id"
                                name="vehicle_id"
                                placeholder="Enter Vehicle ID"
                                value={formData.vehicle_id}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="driver_id">Driver ID</Label>
                            <Input
                                id="driver_id"
                                name="driver_id"
                                placeholder="Enter Driver ID"
                                value={formData.driver_id}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="region_id">Region ID</Label>
                            <Input
                                id="region_id"
                                name="region_id"
                                placeholder="Enter Region ID"
                                value={formData.region_id}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="booking_date">Booking Date</Label>
                            <Input
                                id="booking_date"
                                type="date"
                                name="booking_date"
                                value={formData.booking_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="start_time">Start Time</Label>
                            <Input
                                id="start_time"
                                type="datetime-local"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="end_time">End Time</Label>
                            <Input
                                id="end_time"
                                type="datetime-local"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="purpose">Purpose</Label>
                        <Textarea
                            id="purpose"
                            name="purpose"
                            placeholder="Purpose of booking"
                            value={formData.purpose}
                            onChange={handleChange}
                            rows={3}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex justify-center">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Booking'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
