import { NextResponse } from 'next/server';
import { PERFORMANCE_CONFIG } from '../config/performance';

// In-memory store for rate limiting (in production, use Redis or similar)
const requestCounts = new Map();
const lastReset = new Map();

export async function performanceMiddleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for');
  const now = Date.now();
  
  // Reset counters every minute
  if (!lastReset.has(ip) || now - lastReset.get(ip) > 60000) {
    requestCounts.set(ip, 0);
    lastReset.set(ip, now);
  }

  // Increment request count
  const count = (requestCounts.get(ip) || 0) + 1;
  requestCounts.set(ip, count);

  // Check rate limit
  if (count > PERFORMANCE_CONFIG.rateLimiting.maxRequestsPerMinute) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429 }
    );
  }

  // Start performance monitoring
  const startTime = process.hrtime();

  // Continue with the request
  const response = await NextResponse.next();

  // Calculate response time
  const [seconds, nanoseconds] = process.hrtime(startTime);
  const responseTime = seconds * 1000 + nanoseconds / 1000000;

  // Add performance headers
  response.headers.set('X-Response-Time', `${responseTime.toFixed(2)}ms`);
  response.headers.set('X-RateLimit-Limit', PERFORMANCE_CONFIG.rateLimiting.maxRequestsPerMinute);
  response.headers.set('X-RateLimit-Remaining', PERFORMANCE_CONFIG.rateLimiting.maxRequestsPerMinute - count);

  return response;
} 