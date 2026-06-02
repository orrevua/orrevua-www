"use client"

import { X } from "lucide-react"
import { useTerminal } from "./terminal-provider"

export function TerminalChrome() {
  const { dispatch } = useTerminal()

  return (
    <div className="flex h-10 items-center border-b border-border bg-bg-secondary px-4">
      <div className="flex gap-2">
        <div className="h-3 w-3 rounded-full bg-error" />
        <div className="h-3 w-3 rounded-full bg-warning" />
        <div className="h-3 w-3 rounded-full bg-success" />
      </div>

      <span className="flex-1 text-center font-mono text-xs text-text-tertiary">
        visitor@orrevua:~$
      </span>

      <button
        onClick={() => dispatch({ type: "CLOSE" })}
        className="text-text-tertiary transition-colors hover:text-text-primary"
        aria-label="Close terminal"
      >
        <X size={16} />
      </button>
    </div>
  )
}
