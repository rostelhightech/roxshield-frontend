/**
 * Simple in-memory rate limiter for API routes.
 * Limits requests per IP address within a sliding window.
 * Note: resets on cold start (serverless). For production at scale,
 * consider Redis-based rate limiting (Upstash, etc).
 */

const requests = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requests) {
    if (now > value.resetAt) requests.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  ip: string,
  { maxRequests = 5, windowMs = 60 * 1000 } = {}
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: maxRequests - entry.count };
}
