"use client"

import { useState, type FormEvent } from "react"
import { FeedbackTab } from "./feedback-tab"
import { BlogTab } from "./blog-tab"

type TopTab = "feedback" | "blog"

const inputClassName =
  "w-full rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"

export function AdminShell() {
  const [adminToken, setAdminToken] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [topTab, setTopTab] = useState<TopTab>("feedback")

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus("")
    try {
      const res = await fetch("/api/admin/ping", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (res.status === 401) {
        throw new Error("Invalid admin token.")
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? "Server error. Try again.")
      }
      try {
        window.sessionStorage.setItem("adminToken", adminToken)
        window.localStorage.setItem("adminToken", adminToken)
      } catch {
        // storage unavailable — preview will fall back to redirect
      }
      setIsAuthenticated(true)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to authenticate.")
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  function handleSignOut() {
    setIsAuthenticated(false)
    setAdminToken("")
    setStatus("")
    setTopTab("feedback")
    try {
      window.sessionStorage.removeItem("adminToken")
      window.sessionStorage.removeItem("blogDraftPreview")
      window.localStorage.removeItem("adminToken")
      window.localStorage.removeItem("blogDraftPreview")
    } catch {
      // ignore
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto mt-24 max-w-md rounded-xl border border-border bg-bg-secondary p-8">
        <h1 className="mb-6 text-center text-xl font-semibold text-text-primary">
          Feedback Moderation
        </h1>

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <input
            type="text"
            name="username"
            autoComplete="username"
            value="admin"
            readOnly
            className="hidden"
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
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
    <div>
      <div className="mx-auto mt-6 flex max-w-3xl gap-1 rounded-lg border border-border bg-bg-tertiary p-1">
        <button
          onClick={() => setTopTab("feedback")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            topTab === "feedback"
              ? "bg-bg-secondary text-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Feedback
        </button>
        <button
          onClick={() => setTopTab("blog")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            topTab === "blog"
              ? "bg-bg-secondary text-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Blog
        </button>
      </div>

      {topTab === "feedback" ? (
        <FeedbackTab adminToken={adminToken} onSignOut={handleSignOut} />
      ) : (
        <BlogTab adminToken={adminToken} onSignOut={handleSignOut} />
      )}
    </div>
  )
}
