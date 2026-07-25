"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { SectionLabel } from "@/components/ui/section-label"
import { TechTag } from "@/components/ui/tech-tag"
import { useTranslation } from "@/i18n/context"
import type { BlogPostMeta } from "@/types/blog"

type Props = {
  posts: BlogPostMeta[]
  tags: string[]
}

export function BlogIndexClient({ posts, tags }: Props) {
  const { t, locale } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const activeTag = searchParams.get("tag")

  const filtered = useMemo(() => {
    if (!activeTag) return posts
    return posts.filter((p) => p.tags.includes(activeTag))
  }, [posts, activeTag])

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [locale]
  )

  function selectTag(next: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (next) params.set("tag", next)
    else params.delete("tag")
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <SectionLabel number="/" label={t.blog.sectionLabel} />

      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        {t.blog.indexTitle}
      </h1>
      <p className="mt-3 max-w-2xl text-text-secondary">{t.blog.indexSubtitle}</p>

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
            {t.blog.filterByTag}
          </span>
          <button
            onClick={() => selectTag(null)}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
              !activeTag
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-bg-tertiary text-text-secondary hover:border-accent/50"
            }`}
          >
            {t.blog.filterAll}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => selectTag(tag)}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                activeTag === tag
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-bg-tertiary text-text-secondary hover:border-accent/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-12 text-text-secondary">{t.blog.emptyState}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filtered.map((post) => {
            const tr = post.translations[locale]
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-border bg-bg-secondary p-6 transition hover:scale-[1.02] hover:border-accent/50"
              >
                <div className="flex items-center gap-3 font-mono text-xs text-text-tertiary">
                  <time dateTime={post.date}>
                    {dateFormatter.format(new Date(post.date))}
                  </time>
                  <span aria-hidden>·</span>
                  <span>
                    {t.blog.readingTime.replace("{min}", String(post.readingTimeMin))}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-text-primary">
                  {tr.title}
                </h2>
                <p className="mt-2 text-sm text-text-secondary">{tr.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <TechTag key={tag} name={tag} />
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
