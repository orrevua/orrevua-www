export type BlogLocale = "en" | "pt"

export type BlogFrontmatter = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  cover?: string
}

export type BlogPostMeta = {
  slug: string
  date: string
  tags: string[]
  cover?: string
  readingTimeMin: number
  translations: Record<BlogLocale, { title: string; description: string }>
}

export type BlogPost = BlogPostMeta & {
  content: Record<BlogLocale, string>
}
