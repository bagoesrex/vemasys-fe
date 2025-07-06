import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    const publicPaths = ['/login', '/register', '/_next', '/favicon.ico', '/api']
    const isPublic = publicPaths.some((path) => pathname.startsWith(path))

    if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}
