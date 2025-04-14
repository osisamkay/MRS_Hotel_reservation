import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const middleware = async (request) => {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  
  // Public routes pattern matching for better performance
  const isPublicRoute = /^\/(|hotel-overview|rooms|facilities|photos|reviews|map|information|policies|login|forgot-password|reset-password|signup|success|api\/auth)/.test(pathname);
  
  // API routes pattern (most API routes handle their own auth)
  const isApiRoute = /^\/api\/(?!auth)/.test(pathname);
  
  // Assets and system routes
  const isAssetRoute = /^\/((_next|favicon\.ico|public))/.test(pathname);
  
  if (isPublicRoute || isAssetRoute) {
    return NextResponse.next();
  }
  
  // For API routes, let them handle their own auth
  if (isApiRoute) {
    return NextResponse.next();
  }
  
  // Require authentication for all other routes
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Role-based access control
  const roleRoutePatterns = {
    'admin': /^\/admin|^\/manage/,
    'staff': /^\/staff/,
    'super_admin': /^\/super-admin/
  };
  
  // Check if path requires specific role
  for (const [role, pattern] of Object.entries(roleRoutePatterns)) {
    if (pattern.test(pathname) && token.role !== role && token.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export default middleware;