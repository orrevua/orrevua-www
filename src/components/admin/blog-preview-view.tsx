"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { TechTag } from "@/components/ui/tech-tag"
import { sanitizeHtml } from "@/lib/admin/sanitize-html"

type Draft = {
  frontmatter: { slug: string; date: string; tags: string[]; cover?: string }
  en: { title: string; description: string; bodyHtml: string; readingTimeMin: number }
  pt: { title: string; description: string; bodyHtml: string; readingTimeMin: number }
  locale: "en" | "pt"
  ts: number
}

const MAX_AGE_MS = 60 * 60 * 1000

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return iso
  }
}

export function BlogPreviewView() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [locale, setLocale] = useState<"en" | "pt">("en")

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return
    const token =
      window.sessionStorage.getItem("adminToken") ??
      window.localStorage.getItem("adminToken")
    if (!token) {
      router.replace("/admin")
      return
    }
    const raw =
      window.sessionStorage.getItem("blogDraftPreview") ??
      window.localStorage.getItem("blogDraftPreview")
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Draft
      if (!parsed || Date.now() - parsed.ts > MAX_AGE_MS) return
      setDraft(parsed)
      setLocale(parsed.locale)
    } catch {
      // ignore
    }
  }, [router])

  const activeContent = draft ? draft[locale] : null
  const safeHtml = useMemo(
    () => (activeContent ? sanitizeHtml(activeContent.bodyHtml) : ""),
    [activeContent]
  )

  if (!mounted) return null

  if (!draft) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <p className="text-text-secondary">
              No preview available. Return to the editor and click Preview.
            </p>
            <a href="/admin" className="mt-4 inline-block text-sm text-accent hover:underline">
              Back to admin
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <a
            href="/admin"
            className="font-mono text-sm text-text-secondary transition-colors hover:text-accent"
          >
            ← Back to admin
          </a>
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-xs font-mono text-text-tertiary">
                {formatDate(draft.frontmatter.date)} · {activeContent!.readingTimeMin} min read
              </div>
              <div className="inline-flex rounded-md border border-border bg-bg-tertiary p-1">
                {(["en", "pt"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      locale === l
                        ? "bg-bg-secondary text-text-primary"
                        : "text-text-tertiary hover:text-text-secondary"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-semibold text-text-primary">
              {activeContent!.title}
            </h1>
            {activeContent!.description && (
              <p className="mb-6 text-text-secondary">{activeContent!.description}</p>
            )}
            {draft.frontmatter.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {draft.frontmatter.tags.map((tag) => (
                  <TechTag key={tag} name={tag} />
                ))}
              </div>
            )}
            <article
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
