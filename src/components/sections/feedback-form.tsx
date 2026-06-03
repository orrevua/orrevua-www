"use client"

import { useState, type FormEvent } from "react"
import { useTranslation } from "@/i18n/context"

const inputClassName =
  "w-full rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"

export function FeedbackForm() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { t } = useTranslation()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, message }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? t.feedback.errorMessage)
      }

      setSuccess(true)
      setName("")
      setRole("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t.feedback.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6 mt-10">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {t.feedback.heading}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fb-name" className="text-sm font-medium text-text-secondary">
              {t.feedback.nameLabel}
            </label>
            <input
              id="fb-name"
              type="text"
              required
              placeholder={t.feedback.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="fb-role" className="text-sm font-medium text-text-secondary">
              {t.feedback.roleLabel}
            </label>
            <input
              id="fb-role"
              type="text"
              placeholder={t.feedback.rolePlaceholder}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="fb-email" className="text-sm font-medium text-text-secondary">
            {t.feedback.emailLabel}
          </label>
          <input
            id="fb-email"
            type="email"
            placeholder={t.feedback.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="fb-message" className="text-sm font-medium text-text-secondary">
            {t.feedback.messageLabel}
          </label>
          <textarea
            id="fb-message"
            required
            minLength={10}
            maxLength={1000}
            rows={4}
            placeholder={t.feedback.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={inputClassName}
          />
          <p className="text-text-tertiary text-xs">{message.length}/1000</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-bg-primary hover:bg-accent-hover rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-60"
        >
          {loading ? t.feedback.sending : t.feedback.submit}
        </button>

        {success && (
          <p className="text-sm text-green-400">
            {t.feedback.successMessage}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </form>
    </div>
  )
}
