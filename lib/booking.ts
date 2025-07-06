import api from '@/utils/api'
import Cookies from 'js-cookie'

export async function createBooking(data: any) {
    const token = Cookies.get('token')

    const res = await api.post('/bookings', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return res.data
}
