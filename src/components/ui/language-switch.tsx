"use client"

import { useLocale } from "@/i18n/context"

export function LanguageSwitch() {
  const { locale, toggleLocale } = useLocale()

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-0.5 rounded-full border border-border px-2 py-1 font-mono text-xs transition-colors hover:border-accent"
      aria-label={`Switch to ${locale === "en" ? "Portuguese" : "English"}`}
    >
      <span
        className={locale === "en" ? "text-accent" : "text-text-tertiary"}
      >
        EN
      </span>
      <span className="text-text-tertiary">/</span>
      <span
        className={locale === "pt" ? "text-accent" : "text-text-tertiary"}
      >
        PT
      </span>
    </button>
  )
}
