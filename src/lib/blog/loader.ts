import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import type {
  BlogFrontmatter,
  BlogLocale,
  BlogPost,
  BlogPostMeta,
} from "@/types/blog"

const CONTENT_DIR = join(process.cwd(), "src", "content", "blog")
const LOCALES: BlogLocale[] = ["en", "pt"]
const REQUIRED_KEYS: (keyof BlogFrontmatter)[] = [
  "slug",
  "title",
  "description",
  "date",
  "tags",
]

type ParsedLocale = { frontmatter: BlogFrontmatter; body: string }

function parseLocaleFile(slug: string, locale: BlogLocale): ParsedLocale {
  const filePath = join(CONTENT_DIR, slug, `${locale}.mdx`)
  let raw: string
  try {
    raw = readFileSync(filePath, "utf8")
  } catch {
    throw new Error(
      `[blog] Missing locale file for "${slug}" (${locale}): expected ${filePath}`
    )
  }

  const parsed = matter(raw)
  const data = parsed.data as Partial<BlogFrontmatter>

  for (const key of REQUIRED_KEYS) {
    const value = data[key]
    if (value === undefined || value === null || value === "") {
      throw new Error(
        `[blog] Invalid frontmatter for "${slug}" (${locale}): missing "${key}"`
      )
    }
  }

  if (data.slug !== slug) {
    throw new Error(
      `[blog] Slug mismatch for "${slug}" (${locale}): frontmatter slug is "${data.slug}"`
    )
  }

  if (!Array.isArray(data.tags) || data.tags.some((t) => typeof t !== "string")) {
    throw new Error(
      `[blog] Invalid frontmatter for "${slug}" (${locale}): "tags" must be a string array`
    )
  }

  const isoDate = normalizeDate(data.date, slug, locale)

  const frontmatter: BlogFrontmatter = {
    slug,
    title: String(data.title),
    description: String(data.description),
    date: isoDate,
    tags: data.tags.map((t) => t.trim()).filter(Boolean),
    cover: typeof data.cover === "string" ? data.cover : undefined,
  }

  return { frontmatter, body: parsed.content }
}

function normalizeDate(value: unknown, slug: string, locale: BlogLocale): string {
  const asDate = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(asDate.getTime())) {
    throw new Error(
      `[blog] Invalid frontmatter for "${slug}" (${locale}): "date" is not a valid ISO date`
    )
  }
  return asDate.toISOString().slice(0, 10)
}

function computeReadingTime(bodies: string[]): number {
  const perLocale = bodies.map((body) => {
    const words = body.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
  })
  return Math.max(...perLocale)
}

function loadPost(slug: string): BlogPost {
  const en = parseLocaleFile(slug, "en")
  const pt = parseLocaleFile(slug, "pt")

  const readingTimeMin = computeReadingTime([en.body, pt.body])

  return {
    slug,
    date: en.frontmatter.date,
    tags: en.frontmatter.tags,
    cover: en.frontmatter.cover,
    readingTimeMin,
    translations: {
      en: { title: en.frontmatter.title, description: en.frontmatter.description },
      pt: { title: pt.frontmatter.title, description: pt.frontmatter.description },
    },
    content: { en: en.body, pt: pt.body },
  }
}

function listSlugs(): string[] {
  let entries: string[]
  try {
    entries = readdirSync(CONTENT_DIR)
  } catch {
    return []
  }
  return entries.filter((name) => {
    try {
      return statSync(join(CONTENT_DIR, name)).isDirectory()
    } catch {
      return false
    }
  })
}

function loadAll(): BlogPost[] {
  return listSlugs()
    .map((slug) => loadPost(slug))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function listPosts(): BlogPostMeta[] {
  return loadAll().map(({ content: _content, ...meta }) => {
    void _content
    return meta
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!listSlugs().includes(slug)) return null
  return loadPost(slug)
}

export function listTags(): string[] {
  const tagSet = new Set<string>()
  for (const post of loadAll()) {
    for (const tag of post.tags) tagSet.add(tag)
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
}

export { LOCALES as BLOG_LOCALES }
