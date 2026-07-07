"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Monitor, Dices } from "lucide-react"
import {
  themes,
  applyTheme,
  saveThemePreference,
  getSavedThemeId,
  getThemeSource,
  saveThemeSource,
  clearThemeSource,
} from "@/lib/themes"

type Mode = "system" | "random" | "terminal"
const MODE_KEY = "orrevua-theme-mode"

function saveMode(m: Mode) {
  localStorage.setItem(MODE_KEY, m)
}

export function ThemeModeToggle() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [rolling, setRolling] = useState(false)
  const [rollingName, setRollingName] = useState("")
  const [rollingColor, setRollingColor] = useState("")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const source = getThemeSource()
    if (source === "terminal") {
      setMode("terminal")
    } else {
      setMode((localStorage.getItem(MODE_KEY) as "system" | "random") ?? "system")
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | null
      if (detail === "terminal") {
        setMode("terminal")
      } else {
        setMode("system")
        saveMode("system")
      }
    }
    window.addEventListener("theme-source-change", handler)
    return () => {
      window.removeEventListener("theme-source-change", handler)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (mode !== "system") return
    const mql = window.matchMedia("(prefers-color-scheme: light)")
    const apply = () => {
      const id = mql.matches ? "arctic" : "midnight"
      const theme = themes.find((t) => t.id === id)!
      applyTheme(theme)
      saveThemePreference(id)
    }
    apply()
    mql.addEventListener("change", apply)
    return () => mql.removeEventListener("change", apply)
  }, [mode])

  const rollRandomTheme = useCallback(() => {
    if (rolling) return
    setRolling(true)

    const totalTicks = 14
    const currentId = getSavedThemeId()
    const candidates = themes.filter((t) => t.id !== currentId)
    const winner = candidates[Math.floor(Math.random() * candidates.length)]

    const step = (tick: number) => {
      const t = themes[Math.floor(Math.random() * themes.length)]
      setRollingName(t.name)
      setRollingColor(t.palette["--accent"])

      if (tick >= totalTicks) {
        applyTheme(winner)
        saveThemePreference(winner.id)
        saveThemeSource("toggle")
        setRollingName(winner.name)
        setRollingColor(winner.palette["--accent"])
        timeoutRef.current = setTimeout(() => {
          setRolling(false)
          setRollingName("")
          setRollingColor("")
        }, 600)
        return
      }

      const delay = 80 + tick * 25
      timeoutRef.current = setTimeout(() => step(tick + 1), delay)
    }

    step(0)
  }, [rolling])

  const switchToSystem = () => {
    setMode("system")
    saveMode("system")
    clearThemeSource()
  }

  const switchToRandom = () => {
    setMode("random")
    saveMode("random")
    clearThemeSource()
    rollRandomTheme()
  }

  if (mode === null) return null

  const isTerminal = mode === "terminal"
  const isSystem = mode === "system"
  const isRandom = mode === "random" || isTerminal

  return (
    <div className="flex items-center gap-2">
      {rolling && rollingName && (
        <span
          className="font-mono text-xs animate-pulse"
          style={{ color: rollingColor }}
        >
          {rollingName}
        </span>
      )}
      <div className="relative flex items-center rounded-full border border-border bg-bg-secondary p-0.5 gap-0.5">
        <div
          className="absolute top-0.5 size-7 rounded-full bg-accent transition-all duration-300 ease-in-out"
          style={{ left: isSystem ? "2px" : "calc(100% - 30px)" }}
        />
        <button
          onClick={switchToSystem}
          className={`relative z-10 flex items-center justify-center rounded-full size-7 transition-colors duration-200 ${
            isSystem ? "text-bg-primary" : "text-text-tertiary hover:text-text-secondary"
          }`}
          aria-label="System theme"
          title="System theme (light/dark)"
        >
          <Monitor size={14} />
        </button>
        <button
          onClick={isSystem ? switchToRandom : rollRandomTheme}
          disabled={isTerminal}
          className={`relative z-10 flex items-center justify-center rounded-full size-7 transition-colors duration-200 ${
            isRandom ? "text-bg-primary" : "text-text-tertiary hover:text-text-secondary"
          } ${isTerminal ? "cursor-default" : ""}`}
          aria-label="Random theme"
          title={isTerminal ? "Theme set via terminal" : "Random theme"}
        >
          {rolling ? (
            <Dices size={14} className="animate-spin" />
          ) : isRandom ? (
            <Dices size={14} />
          ) : (
            <span className="text-xs font-bold leading-none" style={{ fontSize: "14px" }}>?</span>
          )}
        </button>
      </div>
    </div>
  )
}
