"use client"

import { useState, useRef, type FormEvent } from "react"
import Link from "next/link"
import { useTranslation } from "@/i18n/context"
import { LanguageSwitch } from "@/components/ui/language-switch"
import { ThemeModeToggle } from "@/components/ui/theme-mode-toggle"

const inputClassName =
  "w-full rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"

export default function FreelancePage() {
  const { t } = useTranslation()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [projectType, setProjectType] = useState("")
  const [budget, setBudget] = useState("")
  const [timeline, setTimeline] = useState("")
  const [description, setDescription] = useState("")

  const honeypotRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const projectTypeOptions = [
    { value: "website", label: t.freelance.projectTypeOptions.website },
    { value: "webapp", label: t.freelance.projectTypeOptions.webapp },
    { value: "api", label: t.freelance.projectTypeOptions.api },
    { value: "automation", label: t.freelance.projectTypeOptions.automation },
    { value: "consulting", label: t.freelance.projectTypeOptions.consulting },
    { value: "other", label: t.freelance.projectTypeOptions.other },
  ]

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    try {
      const selectedType = projectTypeOptions.find((o) => o.value === projectType)
      const res = await fetch("/api/freelance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          projectType: selectedType?.label ?? "",
          budget,
          timeline,
          description,
          website: honeypotRef.current?.value ?? "",
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? t.freelance.errorMessage)
      }

      setSuccess(true)
      setName("")
      setEmail("")
      setCompany("")
      setProjectType("")
      setBudget("")
      setTimeline("")
      setDescription("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t.freelance.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto max-w-2xl px-6 py-10 sm:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm text-text-secondary transition-colors hover:text-accent"
          >
            {t.freelance.backToPortfolio}
          </Link>
          <div className="flex items-center gap-3">
            <ThemeModeToggle />
            <LanguageSwitch />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {t.freelance.title}
        </h1>
        <p className="mt-3 text-text-secondary">{t.freelance.subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute opacity-0 pointer-events-none h-0 w-0"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fr-name" className="mb-1 block text-sm font-medium text-text-secondary">
                {t.freelance.nameLabel}
              </label>
              <input
                id="fr-name"
                type="text"
                required
                maxLength={100}
                placeholder={t.freelance.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="fr-email" className="mb-1 block text-sm font-medium text-text-secondary">
                {t.freelance.emailLabel}
              </label>
              <input
                id="fr-email"
                type="email"
                required
                maxLength={200}
                placeholder={t.freelance.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fr-company" className="mb-1 block text-sm font-medium text-text-secondary">
                {t.freelance.companyLabel}
              </label>
              <input
                id="fr-company"
                type="text"
                maxLength={100}
                placeholder={t.freelance.companyPlaceholder}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="fr-type" className="mb-1 block text-sm font-medium text-text-secondary">
                {t.freelance.projectTypeLabel}
              </label>
              <select
                id="fr-type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className={inputClassName + " appearance-none"}
              >
                <option value="">{t.freelance.projectTypePlaceholder}</option>
                {projectTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fr-budget" className="mb-1 block text-sm font-medium text-text-secondary">
                {t.freelance.budgetLabel}
              </label>
              <input
                id="fr-budget"
                type="text"
                maxLength={100}
                placeholder={t.freelance.budgetPlaceholder}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="fr-timeline" className="mb-1 block text-sm font-medium text-text-secondary">
                {t.freelance.timelineLabel}
              </label>
              <input
                id="fr-timeline"
                type="text"
                maxLength={100}
                placeholder={t.freelance.timelinePlaceholder}
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="fr-description" className="mb-1 block text-sm font-medium text-text-secondary">
              {t.freelance.descriptionLabel}
            </label>
            <textarea
              id="fr-description"
              required
              minLength={20}
              maxLength={3000}
              rows={6}
              placeholder={t.freelance.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-text-tertiary">{description.length}/3000</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-bg-primary transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
          >
            {loading ? t.freelance.sending : t.freelance.submit}
          </button>

          {success && (
            <p className="rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm text-success">
              {t.freelance.successMessage}
            </p>
          )}

          {error && <p className="text-sm text-error">{error}</p>}
        </form>
      </div>
    </main>
  )
}
