"use client"

import { useMemo } from "react"
import { TechTag } from "@/components/ui/tech-tag"
import { useTranslation } from "@/i18n/context"
import type { BlogPostMeta } from "@/types/blog"

export function BlogPostHeader({ post }: { post: BlogPostMeta }) {
  const { t, locale } = useTranslation()

  const tr = post.translations[locale]

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.date)),
    [post.date, locale]
  )

  return (
    <header className="mb-10">
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        {tr.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-text-tertiary">
        <time dateTime={post.date}>
          {t.blog.publishedOn.replace("{date}", formattedDate)}
        </time>
        <span aria-hidden>·</span>
        <span>{t.blog.readingTime.replace("{min}", String(post.readingTimeMin))}</span>
      </div>
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TechTag key={tag} name={tag} />
          ))}
        </div>
      )}
    </header>
  )
}
