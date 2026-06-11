"use client"

import { useEffect } from "react"
import { applyTheme, getSavedThemeId, getThemeById } from "@/lib/themes"

export function ThemeInitializer() {
  useEffect(() => {
    const savedId = getSavedThemeId()
    if (savedId !== "midnight") {
      const theme = getThemeById(savedId)
      if (theme) applyTheme(theme)
    }
  }, [])
  return null
}
