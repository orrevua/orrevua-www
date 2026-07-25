"use client"

type PostRow = {
  slug: string
  date: string
  titleEn: string
  titlePt: string
  tags: string[]
}

export function BlogPostList({
  posts,
  onEdit,
  onDelete,
  busySlug,
}: {
  posts: PostRow[]
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
  busySlug: string | null
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center">
        <p className="text-text-secondary">No posts yet. Create your first post.</p>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {posts.map((p) => (
        <div
          key={p.slug}
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg-secondary px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm text-text-primary">{p.slug}</p>
            <p className="truncate text-xs text-text-secondary">{p.titleEn}</p>
            <p className="mt-1 font-mono text-[10px] text-text-tertiary">
              {p.date} · {p.tags.join(", ")}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => onEdit(p.slug)}
              className="rounded-md border border-border px-3 py-1 text-xs text-text-secondary hover:border-accent hover:text-accent"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(p.slug)}
              disabled={busySlug === p.slug}
              className="rounded-md border border-error px-3 py-1 text-xs text-error hover:bg-error hover:text-bg-primary disabled:opacity-60"
            >
              {busySlug === p.slug ? "…" : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
