import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function NotFound() {
    const cookieStore = await cookies()
    const role = cookieStore.get('role')?.value || 'guest'

    if (role === 'admin') redirect('/admin/dashboard')
    if (role === 'approver_1') redirect('/approver-1/dashboard')
    if (role === 'approver_2') redirect('/approver-2/dashboard')
    redirect('/')
}
