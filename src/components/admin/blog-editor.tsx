"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Field } from "./blog-editor-form"
import {
  applyTranslatedTexts,
  extractTranslatableTexts,
  htmlToMd,
  mdToHtml,
} from "./blog-md-html"
import {
  addPendingImage,
  MAX_IMAGES_PER_POST,
  removePendingImage,
  revokePending,
  stripImagesFromHtml,
  type PendingImage,
} from "./blog-image-manager"

const BlogTiptapEditor = dynamic(
  () => import("./blog-tiptap-editor").then((m) => m.BlogTiptapEditor),
  { ssr: false, loading: () => <div className="min-h-[400px] rounded-lg border border-border bg-bg-tertiary p-4 text-sm text-text-tertiary">Loading editor…</div> }
)

type LocaleFields = { title: string; description: string; html: string }

type PRResult = { prNumber: number; htmlUrl: string; branchName: string }

type PersistedImage = { filename: string; mime: PendingImage["mime"]; dataUrl: string; sizeBytes: number }

type Draft = {
  slug?: string
  date?: string
  tags?: string
  cover?: string
  en?: LocaleFields
  pt?: LocaleFields
  pendingImages?: PersistedImage[]
}

const DRAFT_PREFIX = "blog-draft:"
const DRAFT_SOFT_CAP = 4 * 1024 * 1024

function loadDraft(key: string): Draft | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(DRAFT_PREFIX + key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Draft
  } catch {
    return null
  }
}

function saveDraft(key: string, value: Draft): "ok" | "partial" | "failed" {
  if (typeof window === "undefined") return "failed"
  const full = JSON.stringify(value)
  try {
    if (full.length <= DRAFT_SOFT_CAP) {
      window.localStorage.setItem(DRAFT_PREFIX + key, full)
      return "ok"
    }
    window.localStorage.setItem(DRAFT_PREFIX + key, JSON.stringify({ ...value, pendingImages: [] }))
    return "partial"
  } catch {
    try {
      window.localStorage.setItem(DRAFT_PREFIX + key, JSON.stringify({ ...value, pendingImages: [] }))
      return "partial"
    } catch {
      return "failed"
    }
  }
}

function clearDraft(key: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(DRAFT_PREFIX + key)
}

function pendingToPersisted(list: PendingImage[]): PersistedImage[] {
  return list.map((i) => ({ filename: i.filename, mime: i.mime, dataUrl: i.dataUrl, sizeBytes: i.sizeBytes }))
}

function persistedToPending(list: PersistedImage[]): PendingImage[] {
  return list.map((p) => {
    let blobUrl = p.dataUrl
    try {
      const comma = p.dataUrl.indexOf(",")
      const b64 = p.dataUrl.slice(comma + 1)
      const bin = atob(b64)
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
      blobUrl = URL.createObjectURL(new Blob([bytes], { type: p.mime }))
    } catch {
      // fall back to dataUrl
    }
    return { filename: p.filename, mime: p.mime, blobUrl, dataUrl: p.dataUrl, sizeBytes: p.sizeBytes }
  })
}

function stripDataUrlPrefix(dataUrl: string): string {
  const comma = dataUrl.indexOf(",")
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
}

function computeReadingTime(html: string | undefined | null): number {
  if (!html) return 1
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  const words = text ? text.split(" ").length : 0
  return Math.max(1, Math.ceil(words / 200))
}

function normalizeLocaleFields(input: unknown): LocaleFields {
  const src = (input ?? {}) as Partial<LocaleFields> & { body?: string }
  return {
    title: typeof src.title === "string" ? src.title : "",
    description: typeof src.description === "string" ? src.description : "",
    html:
      typeof src.html === "string"
        ? src.html
        : typeof src.body === "string"
          ? mdToHtml(src.body)
          : "",
  }
}

function embedDataUrls(html: string | undefined | null, images: PendingImage[]): string {
  if (!html) return ""
  if (typeof window === "undefined" || images.length === 0) return html
  const doc = new DOMParser().parseFromString(html, "text/html")
  doc.querySelectorAll("img[data-pending]").forEach((el) => {
    const fn = el.getAttribute("data-pending")
    if (!fn) return
    const match = images.find((i) => i.filename === fn)
    if (match) el.setAttribute("src", match.dataUrl)
  })
  return doc.body.innerHTML
}

export function BlogEditor({
  adminToken,
  mode,
  slug: initialSlug,
  initialBranchName,
  openPRs,
  onDone,
  onCancel,
}: {
  adminToken: string
  mode: "create" | "edit"
  slug?: string
  initialBranchName?: string
  openPRs?: Array<{ prNumber: number; branchName: string; slug: string; action: "save" | "delete"; htmlUrl: string }>
  onDone: () => void
  onCancel: () => void
}) {
  const [originalSlug] = useState<string | undefined>(initialSlug)
  const [slug, setSlug] = useState(initialSlug ?? "")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [tags, setTags] = useState("")
  const [cover, setCover] = useState("")
  const [en, setEn] = useState<LocaleFields>({ title: "", description: "", html: "" })
  const [pt, setPt] = useState<LocaleFields>({ title: "", description: "", html: "" })
  const [activeLocale, setActiveLocale] = useState<"en" | "pt">("en")
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [imagesBanner, setImagesBanner] = useState<string>("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pr, setPr] = useState<PRResult | null>(null)
  const [merging, setMerging] = useState(false)
  const [savedAt, setSavedAt] = useState<string>("")

  const draftKey = originalSlug ?? "__new__"

  useEffect(() => {
    if (pr || !openPRs || !initialSlug) return
    const match = openPRs.find(
      (p) => p.action === "save" && p.slug === initialSlug
    )
    if (match) {
      setPr({
        prNumber: match.prNumber,
        htmlUrl: match.htmlUrl,
        branchName: match.branchName,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPRs, initialSlug])

  useEffect(() => {
    if (mode === "edit" && initialSlug) {
      setLoading(true)
      const ref = initialBranchName ?? "main"
      fetch(
        `/api/admin/blog/get?slug=${encodeURIComponent(initialSlug)}&ref=${encodeURIComponent(ref)}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      )
        .then(async (res) => {
          const body = await res.json()
          if (!res.ok) throw new Error(body?.error ?? "Failed to load post.")
          setSlug(body.slug)
          setDate(body.en.frontmatter.date ?? "")
          setTags(Array.isArray(body.en.frontmatter.tags) ? body.en.frontmatter.tags.join(", ") : "")
          setCover(body.en.frontmatter.cover ?? "")
          setEn({
            title: body.en.frontmatter.title ?? "",
            description: body.en.frontmatter.description ?? "",
            html: mdToHtml(body.en.body ?? ""),
          })
          setPt({
            title: body.pt.frontmatter.title ?? "",
            description: body.pt.frontmatter.description ?? "",
            html: mdToHtml(body.pt.body ?? ""),
          })
        })
        .catch((err) => setStatus(err instanceof Error ? err.message : "Failed to load post."))
        .finally(() => setLoading(false))
    } else {
      const draft = loadDraft(draftKey)
      if (draft) {
        if (draft.slug) setSlug(draft.slug)
        if (draft.date) setDate(draft.date)
        if (draft.tags !== undefined) setTags(draft.tags)
        if (draft.cover !== undefined) setCover(draft.cover)
        if (draft.en) setEn(normalizeLocaleFields(draft.en))
        if (draft.pt) setPt(normalizeLocaleFields(draft.pt))
        if (draft.pendingImages && draft.pendingImages.length > 0) {
          setPendingImages(persistedToPending(draft.pendingImages))
        } else if (draft.en?.html?.includes("data-pending") || draft.pt?.html?.includes("data-pending")) {
          setImagesBanner("Draft loaded (images were not persisted — re-add before publishing).")
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      revokePending(pendingImages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const result = saveDraft(draftKey, {
        slug,
        date,
        tags,
        cover,
        en,
        pt,
        pendingImages: pendingToPersisted(pendingImages),
      })
      if (result === "partial") {
        setImagesBanner("Draft saved (images not persisted — re-add before publishing).")
      }
      setSavedAt(new Date().toLocaleTimeString())
    }, 500)
    return () => clearTimeout(t)
  }, [draftKey, slug, date, tags, cover, en, pt, pendingImages])

  const parsedTags = useMemo(
    () => tags.split(",").map((t) => t.trim()).filter(Boolean),
    [tags]
  )

  const activeFields = activeLocale === "en" ? en : pt
  const setActiveFields = activeLocale === "en" ? setEn : setPt

  function handleLocaleSwitch(next: "en" | "pt") {
    if (next === activeLocale) return
    setActiveLocale(next)
  }

  function handleEditorChange(html: string) {
    setActiveFields({ ...activeFields, html })
  }

  async function handleImagePicked(file: File) {
    if (pendingImages.length >= MAX_IMAGES_PER_POST) {
      setImagesBanner(`Image limit reached (max ${MAX_IMAGES_PER_POST}).`)
      return
    }
    try {
      const img = await addPendingImage(file)
      if (pendingImages.some((p) => p.filename === img.filename)) {
        setImagesBanner(`Duplicate image filename: ${img.filename}.`)
        URL.revokeObjectURL(img.blobUrl)
        return
      }
      setPendingImages((prev) => [...prev, img])
      setImagesBanner("")
      // Editor will consume via onInsertImage callback; see BlogTiptapEditor props.
      window.dispatchEvent(new CustomEvent("blog-editor:insert-image", { detail: { blobUrl: img.blobUrl, filename: img.filename, alt: file.name } }))
    } catch (err) {
      setImagesBanner(err instanceof Error ? err.message : "Image failed.")
    }
  }

  function handleRemoveImage(filename: string) {
    setPendingImages((prev) => removePendingImage(prev, filename))
    setEn((prev) => ({ ...prev, html: stripImagesFromHtml(prev.html, filename) }))
    setPt((prev) => ({ ...prev, html: stripImagesFromHtml(prev.html, filename) }))
  }

  async function handleTranslate() {
    setTranslating(true)
    setStatus("")
    try {
      const { texts, doc, nodes } = extractTranslatableTexts(en.html)
      const res = await fetch("/api/admin/blog/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          title: en.title,
          description: en.description,
          texts,
          from: "en",
          to: "pt",
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error ?? "Translate failed.")
      const translatedHtml = applyTranslatedTexts(
        doc,
        nodes,
        Array.isArray(body.texts) ? body.texts : []
      )
      setPt({ title: body.title, description: body.description, html: translatedHtml })
      setActiveLocale("pt")
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Translate failed.")
    } finally {
      setTranslating(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setStatus("")
    try {
      const enBody = htmlToMd(en.html, slug)
      const ptBody = htmlToMd(pt.html, slug)
      const payloadImages = pendingImages.map((p) => ({
        filename: p.filename,
        mime: p.mime,
        base64: stripDataUrlPrefix(p.dataUrl),
      }))
      const res = await fetch("/api/admin/blog/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          originalSlug,
          slug,
          date,
          tags: parsedTags,
          cover: cover || undefined,
          en: { title: en.title, description: en.description, body: enBody },
          pt: { title: pt.title, description: pt.description, body: ptBody },
          pendingImages: payloadImages.length > 0 ? payloadImages : undefined,
          branchName: pr?.branchName,
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error ?? "Save failed.")
      setPr({ prNumber: body.prNumber, htmlUrl: body.htmlUrl, branchName: body.branchName })
      clearDraft(draftKey)
      revokePending(pendingImages)
      setPendingImages([])
      setStatus(body.updated ? `PR #${body.prNumber} updated.` : `PR #${body.prNumber} opened.`)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed.")
    } finally {
      setSaving(false)
    }
  }

  async function handleMerge() {
    if (!pr) return
    setMerging(true)
    setStatus("")
    try {
      const res = await fetch("/api/admin/blog/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ prNumber: pr.prNumber, branchName: pr.branchName }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error ?? "Merge failed.")
      setStatus(body.message ?? "Merged.")
      onDone()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Merge failed.")
    } finally {
      setMerging(false)
    }
  }

  function handlePreview() {
    if (typeof window === "undefined") return
    const enHtml = embedDataUrls(en.html, pendingImages)
    const ptHtml = embedDataUrls(pt.html, pendingImages)
    const payload = {
      frontmatter: { slug, date, tags: parsedTags, cover: cover || undefined },
      en: {
        title: en.title,
        description: en.description,
        bodyHtml: enHtml,
        readingTimeMin: computeReadingTime(enHtml),
      },
      pt: {
        title: pt.title,
        description: pt.description,
        bodyHtml: ptHtml,
        readingTimeMin: computeReadingTime(ptHtml),
      },
      locale: activeLocale,
      ts: Date.now(),
    }
    try {
      const serialized = JSON.stringify(payload)
      window.sessionStorage.setItem("blogDraftPreview", serialized)
      window.localStorage.setItem("blogDraftPreview", serialized)
      window.open("/admin/blog/preview", "_blank")
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Preview failed.")
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-3xl px-6 py-10 text-text-secondary">Loading…</p>
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">
          {mode === "create" ? "New post" : `Edit ${originalSlug}`}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:border-error hover:text-error"
          >
            Cancel
          </button>
          <button
            onClick={handlePreview}
            className="rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-bg-primary"
          >
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg-primary hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Saving..." : pr ? "Update PR" : "Save & open PR"}
          </button>
        </div>
      </div>

      {status && (
        <p className="mb-4 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary">
          {status}
        </p>
      )}

      {pr && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-accent bg-bg-secondary px-4 py-3">
          <a
            href={pr.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent"
          >
            PR #{pr.prNumber} — {pr.branchName}
          </a>
          <button
            onClick={handleMerge}
            disabled={merging}
            className="rounded-md bg-success px-3 py-1 text-xs font-medium text-bg-primary disabled:opacity-60"
          >
            {merging ? "Merging..." : "Merge & publish"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        <Field label="slug" value={slug} onChange={setSlug} placeholder="my-post" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="date" value={date} onChange={setDate} placeholder="YYYY-MM-DD" />
          <Field label="tags (comma-separated)" value={tags} onChange={setTags} placeholder="a, b" />
        </div>
        <Field label="cover (optional)" value={cover} onChange={setCover} placeholder="/blog/…" />

        <div className="flex items-center gap-2 border-t border-border pt-4">
          <div className="inline-flex rounded-md border border-border bg-bg-tertiary p-1">
            {(["en", "pt"] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLocaleSwitch(l)}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  activeLocale === l
                    ? "bg-bg-secondary text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <Field
          label={`title (${activeLocale.toUpperCase()})`}
          value={activeFields.title}
          onChange={(v) => setActiveFields({ ...activeFields, title: v })}
        />
        <Field
          label={`description (${activeLocale.toUpperCase()})`}
          value={activeFields.description}
          onChange={(v) => setActiveFields({ ...activeFields, description: v })}
        />

        <BlogTiptapEditor
          key={activeLocale}
          html={activeFields.html}
          onChange={handleEditorChange}
          onImagePicked={handleImagePicked}
          disabled={saving}
          imageCount={pendingImages.length}
          maxImages={MAX_IMAGES_PER_POST}
        />

        {(pendingImages.length > 0 || imagesBanner) && (
          <div className="space-y-2 rounded-lg border border-border bg-bg-secondary px-4 py-3">
            {imagesBanner && <p className="text-xs text-text-tertiary">{imagesBanner}</p>}
            {pendingImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pendingImages.map((img) => (
                  <span
                    key={img.filename}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-tertiary px-3 py-1 font-mono text-xs text-text-secondary"
                  >
                    {img.filename} · {(img.sizeBytes / 1024).toFixed(0)} KB
                    <button
                      onClick={() => handleRemoveImage(img.filename)}
                      className="text-text-tertiary hover:text-error"
                      aria-label={`Remove ${img.filename}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="rounded-lg border border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent hover:text-bg-primary disabled:opacity-60"
          >
            {translating ? "Translating..." : "Translate EN → PT"}
          </button>
          {savedAt && (
            <span className="text-xs text-text-tertiary">Draft saved locally · {savedAt}</span>
          )}
        </div>
      </div>
    </div>
  )
}
