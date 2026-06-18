import { projects } from "@/data/projects"

export type OgPreviews = Record<string, string[]>

export async function fetchOgPreviews(): Promise<OgPreviews> {
  const entries = projects
    .filter((p) => p.liveUrl || p.previewUrl || p.previewUrls)
    .map(async (p) => {
      if (p.previewUrls && p.previewUrls.length > 0) {
        return [p.id, p.previewUrls] as const
      }
      if (p.liveUrl) {
        try {
          const res = await fetch(p.liveUrl, { next: { revalidate: 86400 } })
          const html = await res.text()
          const match = html.match(
            /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
          )
          if (match?.[1]) {
            const url = match[1]
            return [p.id, [url.startsWith("http") ? url : new URL(url, p.liveUrl).href]] as const
          }
        } catch {}
      }
      if (p.previewUrl) {
        return [p.id, [p.previewUrl]] as const
      }
      return null
    })

  const results = await Promise.all(entries)
  return Object.fromEntries(results.filter(Boolean) as [string, string[]][])
}
