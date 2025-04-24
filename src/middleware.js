import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/register' || path === '/verify-email' || path === '/reset-password';

    // Get the token from the cookies
    const token = request.cookies.get('token')?.value;

    // Redirect logic
    if (isPublicPath && token) {
        // If trying to access public path while logged in, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isPublicPath && !token) {
        // If trying to access protected path while not logged in, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If accessing protected route, verify token
    if (!isPublicPath && token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user info to request headers
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', decoded.userId);
            requestHeaders.set('x-user-role', decoded.role);

            // Return response with modified headers
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error) {
            // If token is invalid, redirect to login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        '/',
        '/profile',
        '/bookings',
        '/admin/:path*',
        '/login',
        '/register',
        '/verify-email',
        '/reset-password',
    ],
}; 