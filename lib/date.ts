import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function formatToLaravel(datetime: string | Date): string {
    return format(new Date(datetime), 'yyyy-MM-dd HH:mm:ss')
}

export function formatDateOnly(datetime: string | Date): string {
    return format(new Date(datetime), 'yyyy-MM-dd')
}

export function formatTimeOnly(datetime: string | Date): string {
    return format(new Date(datetime), 'HH:mm')
}

export function formatRange(start: string | Date, end: string | Date): string {
    const startStr = format(new Date(start), 'yyyy-MM-dd HH:mm')
    const endStr = format(new Date(end), 'yyyy-MM-dd HH:mm')
    return `${startStr} - ${endStr}`
}

export function formatRangeID(start: string | Date, end: string | Date): string {
    const startStr = format(new Date(start), 'dd MMM yyyy', { locale: id })
    const endStr = format(new Date(end), 'dd MMM yyyy', { locale: id })

    return `${startStr} s.d. ${endStr}`
}

export function formatID(start: string | Date): string {
    const startStr = format(new Date(start), 'dd MMM yyyy', { locale: id })

    return `${startStr}`
}