import type { BlogFrontmatter } from "@/types/blog"

const SLUG_RE = /^[a-z0-9-]{1,60}$/
const TAG_RE = /^[a-z0-9-]{1,24}$/
const COVER_RE = /^\/[A-Za-z0-9/_.-]+\.(png|jpg|jpeg|webp|avif|svg)$/
const DISALLOWED_HTML: RegExp[] = [
  /<script[\s>]/i,
  /<iframe[\s>]/i,
  /<style[\s>]/i,
  /<object[\s>]/i,
  /<embed[\s>]/i,
  /on[a-z]+\s*=/i,
]
const JS_URL_RE = /javascript:/i
const MAX_BODY = 40_000
const BRANCH_RE = /^blog\/([a-z0-9-]+)-(\d{10,13})(-delete)?$/

export type ValidationOk<T> = { valid: true; data: T }
export type ValidationErr = { valid: false; error: string }

export function validateSlug(slug: unknown): ValidationOk<string> | ValidationErr {
  if (typeof slug !== "string") return { valid: false, error: "slug must be a string." }
  if (!SLUG_RE.test(slug)) return { valid: false, error: "slug must match /^[a-z0-9-]{1,60}$/." }
  if (slug.startsWith("-") || slug.endsWith("-"))
    return { valid: false, error: "slug must not start or end with '-'." }
  if (slug.includes("--")) return { valid: false, error: "slug must not contain '--'." }
  return { valid: true, data: slug }
}

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string" && !(value instanceof Date)) return null
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

export function validateFrontmatter(
  input: unknown
): ValidationOk<BlogFrontmatter> | ValidationErr {
  if (!input || typeof input !== "object")
    return { valid: false, error: "frontmatter must be an object." }
  const obj = input as Record<string, unknown>

  const slugRes = validateSlug(obj.slug)
  if (!slugRes.valid) return slugRes

  const title = obj.title
  if (typeof title !== "string" || title.length < 1 || title.length > 120)
    return { valid: false, error: "title length must be 1..120." }

  const description = obj.description
  if (typeof description !== "string" || description.length < 1 || description.length > 280)
    return { valid: false, error: "description length must be 1..280." }

  const date = normalizeDate(obj.date)
  if (!date) return { valid: false, error: "date must be a parseable date." }

  if (!Array.isArray(obj.tags))
    return { valid: false, error: "tags must be an array." }
  if (obj.tags.length > 8)
    return { valid: false, error: "tags must have at most 8 entries." }
  const seen = new Set<string>()
  const tags: string[] = []
  for (const t of obj.tags) {
    if (typeof t !== "string" || !TAG_RE.test(t))
      return { valid: false, error: `invalid tag: ${String(t)}` }
    if (seen.has(t)) continue
    seen.add(t)
    tags.push(t)
  }

  let cover: string | undefined
  if (obj.cover !== undefined && obj.cover !== null && obj.cover !== "") {
    if (typeof obj.cover !== "string" || !COVER_RE.test(obj.cover))
      return { valid: false, error: "cover must be a same-origin /public image path." }
    cover = obj.cover
  }

  return {
    valid: true,
    data: { slug: slugRes.data, title, description, date, tags, cover },
  }
}

export function validateBody(source: unknown): ValidationOk<string> | ValidationErr {
  if (typeof source !== "string") return { valid: false, error: "body must be a string." }
  if (source.length < 1 || source.length > MAX_BODY)
    return { valid: false, error: `body length must be 1..${MAX_BODY}.` }
  for (const re of DISALLOWED_HTML) {
    if (re.test(source)) return { valid: false, error: "MDX contains disallowed HTML." }
  }
  if (JS_URL_RE.test(source))
    return { valid: false, error: "MDX contains disallowed javascript: URL." }
  return { valid: true, data: source }
}

export const IMAGE_FILENAME_RE = /^[a-z0-9][a-z0-9-]{0,60}\.(png|jpg|jpeg|webp)$/
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024
export const MAX_IMAGES_PER_POST = 6
export const ALLOWED_IMAGE_MIMES = ["image/png", "image/jpeg", "image/webp"] as const
export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIMES)[number]

export type ValidatedImage = {
  filename: string
  mime: AllowedImageMime
  buffer: Buffer
}

function sniffMagic(buf: Buffer, mime: AllowedImageMime): boolean {
  if (mime === "image/png") {
    return (
      buf.length >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a
    )
  }
  if (mime === "image/jpeg") {
    return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
  }
  if (mime === "image/webp") {
    return (
      buf.length >= 12 &&
      buf[0] === 0x52 &&
      buf[1] === 0x49 &&
      buf[2] === 0x46 &&
      buf[3] === 0x46 &&
      buf[8] === 0x57 &&
      buf[9] === 0x45 &&
      buf[10] === 0x42 &&
      buf[11] === 0x50
    )
  }
  return false
}

export function validateImage(input: {
  filename?: unknown
  mime?: unknown
  base64?: unknown
}): ValidationOk<ValidatedImage> | ValidationErr {
  const filename = input.filename
  if (typeof filename !== "string" || !IMAGE_FILENAME_RE.test(filename)) {
    return {
      valid: false,
      error: `Image ${String(filename)}: filename must match /^[a-z0-9][a-z0-9-]{0,60}\\.(png|jpg|jpeg|webp)$/.`,
    }
  }
  const mime = input.mime
  if (typeof mime !== "string" || !ALLOWED_IMAGE_MIMES.includes(mime as AllowedImageMime)) {
    return { valid: false, error: `Image ${filename}: MIME/magic-byte mismatch.` }
  }
  const base64 = input.base64
  if (typeof base64 !== "string" || base64.length === 0) {
    return { valid: false, error: `Image ${filename}: MIME/magic-byte mismatch.` }
  }
  let buffer: Buffer
  try {
    buffer = Buffer.from(base64, "base64")
  } catch {
    return { valid: false, error: `Image ${filename}: MIME/magic-byte mismatch.` }
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    return { valid: false, error: `Image ${filename} exceeds 2 MiB.` }
  }
  const typedMime = mime as AllowedImageMime
  if (!sniffMagic(buffer, typedMime)) {
    return { valid: false, error: `Image ${filename}: MIME/magic-byte mismatch.` }
  }
  return { valid: true, data: { filename, mime: typedMime, buffer } }
}

export function validateImageBatch(
  list: unknown,
  bodies: string[]
): ValidationOk<ValidatedImage[]> | ValidationErr {
  if (list === undefined || list === null) return { valid: true, data: [] }
  if (!Array.isArray(list)) return { valid: false, error: "pendingImages must be an array." }
  if (list.length > MAX_IMAGES_PER_POST) {
    return { valid: false, error: "Too many pending images (max 6)." }
  }
  const seen = new Set<string>()
  const validated: ValidatedImage[] = []
  for (const entry of list) {
    const res = validateImage(entry as Record<string, unknown>)
    if (!res.valid) return res
    if (seen.has(res.data.filename)) {
      return { valid: false, error: `Duplicate image filename: ${res.data.filename}.` }
    }
    seen.add(res.data.filename)
    const referenced = bodies.some((b) => b.includes(res.data.filename))
    if (!referenced) {
      return { valid: false, error: `Image ${res.data.filename}: unreferenced in body.` }
    }
    validated.push(res.data)
  }
  return { valid: true, data: validated }
}

export function blogBranchName(slug: string, kind: "save" | "delete"): string {
  const suffix = kind === "delete" ? "-delete" : ""
  return `blog/${slug}-${Date.now()}${suffix}`
}

export function parseBlogBranch(
  name: string
): { slug: string; kind: "save" | "delete" } | null {
  const m = BRANCH_RE.exec(name)
  if (!m) return null
  return { slug: m[1], kind: m[3] ? "delete" : "save" }
}
