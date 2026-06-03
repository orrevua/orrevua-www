"use client"

import { useCallback } from "react"
import { TerminalProvider, useTerminal } from "./terminal-provider"
import { TerminalOverlay } from "./terminal-overlay"
import { useKeydown } from "@/lib/hooks/use-keydown"
import { LocaleProvider } from "@/i18n/context"

function TerminalKeyboardBinder() {
  const { toggle } = useTerminal()
  const stableToggle = useCallback(() => toggle(), [toggle])
  useKeydown("`", true, stableToggle)
  return null
}

export function TerminalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <TerminalProvider>
        <TerminalKeyboardBinder />
        {children}
        <TerminalOverlay />
      </TerminalProvider>
    </LocaleProvider>
  )
}
