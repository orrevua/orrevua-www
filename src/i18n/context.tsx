"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { Locale, Translations } from "./types"
import { translations as en } from "./locales/en"
import { translations as pt } from "./locales/pt"

const localeMap: Record<Locale, Translations> = { en, pt }

const STORAGE_KEY = "locale"
const DEFAULT_LOCALE: Locale = "en"

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "en" || stored === "pt") return stored
  return DEFAULT_LOCALE
}

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

type TranslationContextValue = {
  t: Translations
  locale: Locale
}

const TranslationContext = createContext<TranslationContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "en" ? "pt" : "en"))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const t = localeMap[locale]

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      <TranslationContext.Provider value={{ t, locale }}>
        {children}
      </TranslationContext.Provider>
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return ctx
}

export function useTranslation(): TranslationContextValue {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error("useTranslation must be used within a LocaleProvider")
  }
  return ctx
}
