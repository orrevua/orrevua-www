"use client"

import { useCallback } from "react"
import { TerminalProvider, useTerminal } from "./terminal-provider"
import { TerminalOverlay } from "./terminal-overlay"
import { useKeydown } from "@/lib/hooks/use-keydown"

function TerminalKeyboardBinder() {
  const { toggle } = useTerminal()
  const stableToggle = useCallback(() => toggle(), [toggle])
  useKeydown("t", true, stableToggle)
  return null
}

export function TerminalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TerminalProvider>
      <TerminalKeyboardBinder />
      {children}
      <TerminalOverlay />
    </TerminalProvider>
  )
}
