const COOLDOWN_MS = 60_000
const memoryMap = new Map<string, number>()

function checkMemoryLimit(id: string): { allowed: boolean; retryAfterMs: number } {
  const lastRequest = memoryMap.get(id)
  const now = Date.now()
  if (lastRequest && now - lastRequest < COOLDOWN_MS) {
    return { allowed: false, retryAfterMs: COOLDOWN_MS - (now - lastRequest) }
  }
  memoryMap.set(id, now)
  return { allowed: true, retryAfterMs: 0 }
}

export async function checkRateLimit(
  id: string
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  return checkMemoryLimit(id)
}
