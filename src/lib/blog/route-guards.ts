import { NextRequest, NextResponse } from "next/server"
import { isAdminTokenConfigured, isAuthorizedAdmin } from "@/lib/admin-auth"
import { checkRateLimit } from "@/lib/rate-limit"

export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!isAdminTokenConfigured()) {
    console.warn("ADMIN_SECRET_TOKEN is not set.")
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 })
  }
  if (!isAuthorizedAdmin(req.headers.get("Authorization"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }
  return null
}

export function requireSameOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin")
  if (!origin) return null
  const host = req.headers.get("host")
  if (!host) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 })
  }
  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 })
  }
  return null
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ??
    "unknown"
  )
}

const buckets = new Map<string, number[]>()

export function tokenBucket(
  key: string,
  max: number,
  windowMs: number
): NextResponse | null {
  const now = Date.now()
  const cutoff = now - windowMs
  const stamps = (buckets.get(key) ?? []).filter((t) => t > cutoff)
  if (stamps.length >= max) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429 }
    )
  }
  stamps.push(now)
  buckets.set(key, stamps)
  return null
}

export async function enforceRateLimit(
  key: string
): Promise<NextResponse | null> {
  const limit = await checkRateLimit(key)
  if (limit.allowed) return null
  return NextResponse.json(
    { error: "Too many requests. Please wait before retrying." },
    {
      status: 429,
      headers:
        limit.retryAfterMs > 0
          ? { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) }
          : undefined,
    }
  )
}
