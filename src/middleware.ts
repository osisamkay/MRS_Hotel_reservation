import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

    // If trying to access admin routes
    if (isAdminRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Check if user has admin or super_admin role
        if (!['admin', 'super_admin'].includes(token.role as string)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}; 