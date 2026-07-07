import type { ThemeDefinition } from "./types"

const STORAGE_KEY = "orrevua-theme"
const SOURCE_KEY = "orrevua-theme-source"

export type ThemeSource = "terminal" | "toggle"

export function saveThemeSource(source: ThemeSource): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SOURCE_KEY, source)
  window.dispatchEvent(new CustomEvent("theme-source-change", { detail: source }))
}

export function getThemeSource(): ThemeSource | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(SOURCE_KEY) as ThemeSource | null
}

export function clearThemeSource(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SOURCE_KEY)
  window.dispatchEvent(new CustomEvent("theme-source-change", { detail: null }))
}

export function applyTheme(theme: ThemeDefinition): void {
  if (typeof window === "undefined") return
  const root = document.documentElement
  for (const [prop, value] of Object.entries(theme.palette)) {
    root.style.setProperty(prop, value)
  }
}

export function saveThemePreference(themeId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, themeId)
}

export function getSavedThemeId(): string {
  if (typeof window === "undefined") return "midnight"
  return localStorage.getItem(STORAGE_KEY) ?? "midnight"
}

export function resetTheme(): void {
  if (typeof window === "undefined") return
  const root = document.documentElement
  const vars = [
    "--bg-primary", "--bg-secondary", "--bg-tertiary", "--border",
    "--text-primary", "--text-secondary", "--text-tertiary",
    "--accent", "--accent-hover", "--accent-muted",
    "--success", "--warning", "--error",
  ]
  for (const v of vars) {
    root.style.removeProperty(v)
  }
}
