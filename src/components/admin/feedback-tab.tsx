"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface FeedbackPR {
  prNumber: number
  title: string
  branchName: string
  feedbackId?: string
  htmlUrl: string
  reverted?: boolean
  data: {
    name: string
    role: string
    company: string
    message: string
    messageEn: string
    messagePt: string
    date: string
  }
}

type Tab = "pending" | "merged"

const inputClassName =
  "w-full rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"

export function FeedbackTab({
  adminToken,
  onSignOut,
}: {
  adminToken: string
  onSignOut: () => void
}) {
  const [feedbacks, setFeedbacks] = useState<FeedbackPR[]>([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [status, setStatus] = useState("")
  const [statusKind, setStatusKind] = useState<"info" | "error">("info")
  const [tab, setTab] = useState<Tab>("pending")

  function notify(text: string, kind: "info" | "error" = "info") {
    setStatus(text)
    setStatusKind(kind)
  }

  async function readError(res: Response, fallback: string): Promise<string> {
    const body = (await res.json().catch(() => null)) as
      | { error?: string; details?: string }
      | null
    const base = body?.error ?? fallback
    return body?.details ? `${base} (${body.details})` : base
  }
  const [translations, setTranslations] = useState<
    Record<string, { messageEn: string; messagePt: string }>
  >({})
  const [savingTranslation, setSavingTranslation] = useState<string | null>(null)

  async function fetchFeedbacks(state: Tab = tab) {
    setLoading(true)
    setStatus("")

    try {
      const query = state === "merged" ? "?state=merged" : ""
      const res = await fetch(`/api/admin/list${query}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })

      if (!res.ok) {
        throw new Error(await readError(res, "Failed to load feedbacks."))
      }

      const data: FeedbackPR[] = await res.json()
      setFeedbacks(data)
      const initialTranslations: Record<string, { messageEn: string; messagePt: string }> = {}
      for (const fb of data) {
        if (fb.feedbackId) {
          initialTranslations[fb.feedbackId] = {
            messageEn: fb.data.messageEn,
            messagePt: fb.data.messagePt,
          }
        }
      }
      setTranslations((prev) => ({ ...prev, ...initialTranslations }))
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Failed to load feedbacks.",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks("pending")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleTabSwitch(newTab: Tab) {
    setTab(newTab)
    setFeedbacks([])
    fetchFeedbacks(newTab)
  }

  async function handleModerate(
    prNumber: number,
    branchName: string,
    action: "approve" | "reject" | "revert"
  ) {
    if (!confirm(`Are you sure you want to ${action} PR #${prNumber}?`)) return

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
        throw new Error(await readError(res, `Failed to ${action}.`))
      }

      const body = await res.json()
      setFeedbacks((prev) => prev.filter((f) => f.prNumber !== prNumber))
      notify(body.message ?? `PR #${prNumber} — ${action} successful.`, "info")
    } catch (err) {
      notify(
        err instanceof Error ? err.message : `Failed to ${action}.`,
        "error"
      )
    } finally {
      setProcessingId(null)
    }
  }

  async function handleSaveTranslation(fb: FeedbackPR) {
    if (!fb.feedbackId) return
    const t = translations[fb.feedbackId]
    if (!t) return

    setSavingTranslation(fb.feedbackId)
    setStatus("")

    try {
      const res = await fetch("/api/admin/update-translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          branchName: fb.branchName,
          feedbackId: fb.feedbackId,
          messageEn: t.messageEn,
          messagePt: t.messagePt,
        }),
      })

      if (!res.ok) {
        throw new Error(await readError(res, "Failed to save translations."))
      }

      notify(`Translations saved for ${fb.feedbackId}.`, "info")
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Failed to save translations.",
        "error"
      )
    } finally {
      setSavingTranslation(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Feedback Moderation
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
            onClick={() => fetchFeedbacks()}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={onSignOut}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-error hover:text-error"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-bg-tertiary p-1">
        <button
          onClick={() => handleTabSwitch("pending")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "pending"
              ? "bg-bg-secondary text-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleTabSwitch("merged")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "merged"
              ? "bg-bg-secondary text-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Approved
        </button>
      </div>

      {status && (
        <p
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            statusKind === "error"
              ? "border-error bg-bg-secondary text-error"
              : "border-border bg-bg-secondary text-text-secondary"
          }`}
        >
          {status}
        </p>
      )}

      {feedbacks.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center">
          <p className="text-text-secondary">
            {tab === "pending"
              ? "No pending feedback PRs"
              : "No approved feedbacks yet"}
          </p>
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

              {(fb.data.role || fb.data.company) && (
                <p className="mt-1 font-mono text-sm text-accent">
                  {[fb.data.role, fb.data.company].filter(Boolean).join(" - ")}
                </p>
              )}

              <p className="mt-3 whitespace-pre-wrap text-text-secondary">
                {fb.data.message}
              </p>

              {tab === "pending" && fb.feedbackId && translations[fb.feedbackId] && (
                <div className="mt-4 space-y-3 rounded-lg border border-border bg-bg-tertiary p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                    Translations
                  </p>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">
                      English
                    </label>
                    <textarea
                      rows={2}
                      value={translations[fb.feedbackId].messageEn}
                      onChange={(e) =>
                        setTranslations((prev) => ({
                          ...prev,
                          [fb.feedbackId!]: {
                            ...prev[fb.feedbackId!],
                            messageEn: e.target.value,
                          },
                        }))
                      }
                      className={inputClassName + " text-sm"}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">
                      Português
                    </label>
                    <textarea
                      rows={2}
                      value={translations[fb.feedbackId].messagePt}
                      onChange={(e) =>
                        setTranslations((prev) => ({
                          ...prev,
                          [fb.feedbackId!]: {
                            ...prev[fb.feedbackId!],
                            messagePt: e.target.value,
                          },
                        }))
                      }
                      className={inputClassName + " text-sm"}
                    />
                  </div>

                  <button
                    onClick={() => handleSaveTranslation(fb)}
                    disabled={savingTranslation !== null}
                    className="rounded-lg border border-accent px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-bg-primary disabled:opacity-60"
                  >
                    {savingTranslation === fb.feedbackId
                      ? "Saving..."
                      : "Save translations"}
                  </button>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                {tab === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        handleModerate(fb.prNumber, fb.branchName, "approve")
                      }
                      disabled={processingId !== null}
                      className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-bg-primary disabled:opacity-60"
                    >
                      {processingId === fb.prNumber
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        handleModerate(fb.prNumber, fb.branchName, "reject")
                      }
                      disabled={processingId !== null}
                      className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-bg-primary disabled:opacity-60"
                    >
                      {processingId === fb.prNumber
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      handleModerate(fb.prNumber, fb.branchName, "revert")
                    }
                    disabled={processingId !== null || Boolean(fb.reverted)}
                    className={`rounded-lg border border-error bg-transparent px-4 py-2 text-sm font-medium disabled:opacity-60 ${
                      fb.reverted ? "text-text-tertiary border-border" : "text-error"
                    }`}
                  >
                    {fb.reverted
                      ? "Reverted"
                      : processingId === fb.prNumber
                      ? "Reverting..."
                      : "Revert"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
