"use client"

import { X } from "lucide-react"
import { useTerminal } from "./terminal-provider"

export function TerminalChrome() {
  const { dispatch } = useTerminal()

  return (
    <div className="flex h-10 items-center border-b border-border bg-bg-secondary px-4">
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: "CLOSE" })}
          aria-label="Close terminal"
          title="Close"
          className="h-3 w-3 rounded-full bg-error"
        />

        <button
          onClick={() => dispatch({ type: "MINIMIZE" })}
          aria-label="Minimize terminal"
          title="Minimize"
          className="h-3 w-3 rounded-full bg-warning"
        />

        <button
          onClick={() => dispatch({ type: "MAXIMIZE" })}
          aria-label="Maximize terminal"
          title="Maximize"
          className="h-3 w-3 rounded-full bg-success"
        />
      </div>

      <span className="flex-1 text-center font-mono text-xs text-text-tertiary">
        visitor@orrevua:~$
      </span>
    </div>
  )
}
