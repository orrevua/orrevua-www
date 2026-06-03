import { timingSafeEqual } from "crypto"

export function parseBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null
  const [scheme, token] = authHeader.split(" ")
  if (scheme !== "Bearer" || !token) return null
  return token
}

export function isAdminTokenConfigured(): boolean {
  return Boolean(process.env.ADMIN_SECRET_TOKEN)
}

export function isAuthorizedAdmin(authHeader: string | null): boolean {
  const secret = process.env.ADMIN_SECRET_TOKEN
  if (!secret) return false
  const token = parseBearerToken(authHeader)
  if (!token) return false

  const secretBuf = Buffer.from(secret)
  const tokenBuf = Buffer.from(token)
  const safeTokenBuf =
    tokenBuf.length === secretBuf.length
      ? tokenBuf
      : Buffer.alloc(secretBuf.length)
  const isEqual = timingSafeEqual(secretBuf, safeTokenBuf)
  return isEqual && tokenBuf.length === secretBuf.length
}
