import { NextResponse } from "next/server";

const rateLimit = 10; // requests
const timeWindow = 60; // seconds
const ipCache = new Map();

// Clean up old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipCache.entries()) {
    if (now - data.timestamp > timeWindow * 1000) {
      ipCache.delete(ip);
    }
  }
}, 60000);

export async function middleware(request) {
  // Only apply to /api/create-checkout
  if (request.nextUrl.pathname === "/api/create-checkout") {
    const ip =
      request.ip ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for") ||
      "anonymous";
    const now = Date.now();

    console.log("Request IP:", ip);

    const ipData = ipCache.get(ip) || { count: 0, timestamp: now };

    // Reset if outside time window
    if (now - ipData.timestamp > timeWindow * 1000) {
      ipData.count = 0;
      ipData.timestamp = now;
    }

    console.log("Current request count:", ipData.count);

    ipData.count++;
    ipCache.set(ip, ipData);

    // Check if rate limit exceeded
    if (ipData.count > rateLimit) {
      // For API requests (fetch/ajax calls)
      const isApiRequest =
        request.headers.get("accept")?.includes("application/json") ||
        request.headers.get("content-type")?.includes("application/json");

      console.log("isApiRequest", isApiRequest);
      
      if (isApiRequest) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: "Rate limit exceeded",
            message: "Too many requests, please try again later",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": rateLimit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": (
                Math.ceil(ipData.timestamp / 1000) + timeWindow
              ).toString(),
            },
          }
        );
      } else {
        // For browser requests, redirect to rate-limit page
        // Create a URL object with the correct path
        const rateLimitUrl = new URL("/rate-limit", request.nextUrl.origin);
        return NextResponse.redirect(rateLimitUrl);
      }
    }

    // Continue with the request
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/create-checkout"],
};