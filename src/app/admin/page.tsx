"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

interface FeedbackPR {
  prNumber: number
  title: string
  branchName: string
  htmlUrl: string
  data: {
    name: string
    message: string
    date: string
  }
}

const inputClassName =
  "w-full rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [feedbacks, setFeedbacks] = useState<FeedbackPR[]>([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [status, setStatus] = useState("")

  async function fetchFeedbacks(token: string) {
    setLoading(true)
    setStatus("")

    try {
      const res = await fetch("/api/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? "Failed to authenticate.")
      }

      const data: FeedbackPR[] = await res.json()
      setFeedbacks(data)
      setIsAuthenticated(true)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to authenticate.")
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    await fetchFeedbacks(adminToken)
  }

  async function handleModerate(prNumber: number, branchName: string, action: "approve" | "reject") {
    const label = action === "approve" ? "approve" : "reject"
    if (!confirm(`Are you sure you want to ${label} PR #${prNumber}?`)) return

    setProcessingId(prNumber)
    setStatus("")

    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ prNumber, branchName, action }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? `Failed to ${label}.`)
      }

      const body = await res.json()
      setFeedbacks((prev) => prev.filter((f) => f.prNumber !== prNumber))
      setStatus(body.message ?? `PR #${prNumber} ${label}d successfully.`)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : `Failed to ${label}.`)
    } finally {
      setProcessingId(null)
    }
  }

  function handleSignOut() {
    setIsAuthenticated(false)
    setAdminToken("")
    setFeedbacks([])
    setStatus("")
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto mt-24 max-w-md rounded-xl border border-border bg-bg-secondary p-8">
        <h1 className="mb-6 text-center text-xl font-semibold text-text-primary">
          Feedback Moderation
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            required
            placeholder="Admin token"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            className={inputClassName}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-bg-primary hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Sign in"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-error">{status}</p>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Pending Feedbacks
          </h1>
          <Link
            href="/"
            className="mt-1 inline-block text-sm text-text-secondary transition-colors hover:text-accent"
          >
            &larr; Back to portfolio
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchFeedbacks(adminToken)}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={handleSignOut}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-error hover:text-error"
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

      {feedbacks.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center">
          <p className="text-text-secondary">No pending feedback PRs</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div
              key={fb.prNumber}
              className="rounded-xl border border-border bg-bg-secondary p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-text-primary">
                    {fb.data.name}
                  </p>
                  <p className="font-mono text-xs text-text-tertiary">
                    {new Date(fb.data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <a
                  href={fb.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-mono text-sm text-accent"
                >
                  PR #{fb.prNumber}
                </a>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-text-secondary">
                {fb.data.message}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleModerate(fb.prNumber, fb.branchName, "approve")}
                  disabled={processingId !== null}
                  className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-bg-primary disabled:opacity-60"
                >
                  {processingId === fb.prNumber ? "Processing..." : "Approve"}
                </button>

                <button
                  onClick={() => handleModerate(fb.prNumber, fb.branchName, "reject")}
                  disabled={processingId !== null}
                  className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-bg-primary disabled:opacity-60"
                >
                  {processingId === fb.prNumber ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
