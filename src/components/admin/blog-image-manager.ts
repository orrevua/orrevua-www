"use client"

export type PendingImageMime = "image/png" | "image/jpeg" | "image/webp"

export type PendingImage = {
  filename: string
  mime: PendingImageMime
  blobUrl: string
  dataUrl: string
  sizeBytes: number
}

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024
export const MAX_IMAGES_PER_POST = 6
const ALLOWED_MIMES: PendingImageMime[] = ["image/png", "image/jpeg", "image/webp"]
const EXT_BY_MIME: Record<PendingImageMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
}

function slugifyBase(name: string): string {
  const withoutExt = name.replace(/\.[^.]+$/, "")
  const cleaned = withoutExt
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{ASCII}]/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  return cleaned || "image"
}

async function shortHash(buffer: ArrayBuffer): Promise<string> {
  try {
    const digest = await crypto.subtle.digest("SHA-256", buffer)
    const bytes = Array.from(new Uint8Array(digest).slice(0, 3))
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("")
  } catch {
    return Math.random().toString(36).slice(2, 8)
  }
}

function bufferToDataUrl(buffer: ArrayBuffer, mime: PendingImageMime): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return `data:${mime};base64,${btoa(binary)}`
}

export async function addPendingImage(file: File): Promise<PendingImage> {
  if (!ALLOWED_MIMES.includes(file.type as PendingImageMime)) {
    throw new Error("Only PNG, JPEG, and WEBP images are allowed.")
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image too large (max 2 MiB) — not added.")
  }
  const buffer = await file.arrayBuffer()
  const mime = file.type as PendingImageMime
  const ext = EXT_BY_MIME[mime]
  const base = slugifyBase(file.name)
  const hash = await shortHash(buffer)
  const filename = `${base}-${hash}.${ext}`
  const blob = new Blob([buffer], { type: mime })
  const blobUrl = URL.createObjectURL(blob)
  const dataUrl = bufferToDataUrl(buffer, mime)
  return { filename, mime, blobUrl, dataUrl, sizeBytes: file.size }
}

export function removePendingImage(list: PendingImage[], filename: string): PendingImage[] {
  const target = list.find((i) => i.filename === filename)
  if (target) URL.revokeObjectURL(target.blobUrl)
  return list.filter((i) => i.filename !== filename)
}

export function revokePending(list: PendingImage[]): void {
  for (const img of list) URL.revokeObjectURL(img.blobUrl)
}

export function stripImagesFromHtml(html: string, filename: string): string {
  if (typeof window === "undefined") return html
  const doc = new DOMParser().parseFromString(html, "text/html")
  doc.querySelectorAll(`img[data-pending="${CSS.escape(filename)}"]`).forEach((n) => n.remove())
  return doc.body.innerHTML
}
