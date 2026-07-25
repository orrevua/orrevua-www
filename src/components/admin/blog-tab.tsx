"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { BlogPostList } from "./blog-post-list"
import { BlogEditor } from "./blog-editor"

type PostRow = {
  slug: string
  date: string
  titleEn: string
  titlePt: string
  tags: string[]
}

type OpenPR = {
  prNumber: number
  branchName: string
  slug: string
  action: "save" | "delete"
  htmlUrl: string
  createdAt: string
}

type Editing =
  | { mode: "create" }
  | { mode: "edit"; slug: string; branchName?: string }
  | null

export function BlogTab({
  adminToken,
  onSignOut,
}: {
  adminToken: string
  onSignOut: () => void
}) {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [openPRs, setOpenPRs] = useState<OpenPR[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [busySlug, setBusySlug] = useState<string | null>(null)
  const [mergingPR, setMergingPR] = useState<number | null>(null)
  const [editing, setEditing] = useState<Editing>(null)

  const fetchList = useCallback(async () => {
    setLoading(true)
    setStatus("")
    try {
      const res = await fetch("/api/admin/blog/list", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? "Failed to load posts.")
      }
      const data = await res.json()
      setPosts(data.posts)
      setOpenPRs(data.openPRs)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to load posts.")
    } finally {
      setLoading(false)
    }
  }, [adminToken])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  async function handleDelete(slug: string) {
    if (!confirm(`Open a PR to delete "${slug}"?`)) return
    setBusySlug(slug)
    setStatus("")
    try {
      const res = await fetch("/api/admin/blog/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ slug }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error ?? "Delete failed.")
      setStatus(`Delete PR opened: #${body.prNumber}`)
      await fetchList()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Delete failed.")
    } finally {
      setBusySlug(null)
    }
  }

  async function handleMerge(pr: OpenPR) {
    if (!confirm(`Merge PR #${pr.prNumber} (${pr.branchName})?`)) return
    setMergingPR(pr.prNumber)
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
      await fetchList()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Merge failed.")
    } finally {
      setMergingPR(null)
    }
  }

  if (editing) {
    return (
      <BlogEditor
        adminToken={adminToken}
        mode={editing.mode}
        slug={editing.mode === "edit" ? editing.slug : undefined}
        initialBranchName={editing.mode === "edit" ? editing.branchName : undefined}
        openPRs={openPRs}
        onDone={async () => {
          setEditing(null)
          await fetchList()
        }}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Blog CMS</h1>
          <Link
            href="/"
            className="mt-1 inline-block text-sm text-text-secondary transition-colors hover:text-accent"
          >
            &larr; Back to portfolio
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing({ mode: "create" })}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg-primary hover:bg-accent-hover"
          >
            + New post
          </button>
          <button
            onClick={fetchList}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={onSignOut}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:border-error hover:text-error"
          >
            Sign out
          </button>
        </div>
      </div>

      {status && (
        <p className="mb-6 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary">
          {status}
        </p>
      )}

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          Posts (from main)
        </h2>
        <BlogPostList
          posts={posts}
          onEdit={(slug) => setEditing({ mode: "edit", slug })}
          onDelete={handleDelete}
          busySlug={busySlug}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          Open blog PRs
        </h2>
        {openPRs.length === 0 ? (
          <p className="text-sm text-text-secondary">No open blog PRs.</p>
        ) : (
          <div className="space-y-2">
            {openPRs.map((pr) => (
              <div
                key={pr.prNumber}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg-secondary px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-text-primary">
                    #{pr.prNumber} {pr.branchName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {pr.action} · {pr.slug}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {pr.action === "save" && (
                    <button
                      onClick={() =>
                        setEditing({ mode: "edit", slug: pr.slug, branchName: pr.branchName })
                      }
                      className="rounded-md border border-accent px-3 py-1 text-xs text-accent hover:bg-accent hover:text-bg-primary"
                    >
                      Continue editing
                    </button>
                  )}
                  <a
                    href={pr.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-border px-3 py-1 text-xs text-text-secondary hover:border-accent hover:text-accent"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleMerge(pr)}
                    disabled={mergingPR !== null}
                    className="rounded-md bg-success px-3 py-1 text-xs font-medium text-bg-primary disabled:opacity-60"
                  >
                    {mergingPR === pr.prNumber ? "Merging..." : "Merge"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
