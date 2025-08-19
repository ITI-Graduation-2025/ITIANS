import { NextResponse } from "next/server";

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 3; // Maximum 3 requests per hour per IP

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get client IP (you might need to adjust this based on your setup)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    const now = Date.now();
    const key = `${ip}:${email}`;

    // Check rate limit
    const userRequests = rateLimitStore.get(key) || [];
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
    );

    if (validRequests.length >= MAX_REQUESTS) {
      return NextResponse.json(
        {
          error: "Too many password reset requests. Please try again later.",
          retryAfter: Math.ceil(
            (validRequests[0] + RATE_LIMIT_WINDOW - now) / 1000 / 60,
          ),
        },
        { status: 429 },
      );
    }

    // Add current request to rate limit store
    validRequests.push(now);
    rateLimitStore.set(key, validRequests);

    // Clean up old entries (optional, to prevent memory leaks)
    if (rateLimitStore.size > 1000) {
      const cutoff = now - RATE_LIMIT_WINDOW;
      for (const [key, requests] of rateLimitStore.entries()) {
        const valid = requests.filter((timestamp) => timestamp > cutoff);
        if (valid.length === 0) {
          rateLimitStore.delete(key);
        } else {
          rateLimitStore.set(key, valid);
        }
      }
    }

    // Return success - the actual password reset will be handled by the client
    return NextResponse.json(
      { message: "Rate limit check passed" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Rate limiting error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
