"use client"

import { useEffect, useRef } from "react"
import { useTerminal } from "./terminal-provider"
import { autocomplete } from "@/lib/terminal/autocomplete"
import { getAllCommands } from "@/lib/terminal/commands"
import { output, line } from "@/lib/terminal/formatter"
import type { TerminalHistoryEntry } from "@/types"

export function TerminalInput() {
  const {
    state,
    dispatch,
    submitCommand,
    setInput,
    navigateUp,
    navigateDown,
    clear,
  } = useTerminal()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [state.isOpen])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      if (state.currentInput.trim()) {
        submitCommand(state.currentInput)
      }
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      navigateUp()
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      navigateDown()
      return
    }

    if (e.key === "Tab") {
      e.preventDefault()
      const commandNames = getAllCommands().map((c) => c.name)
      const result = autocomplete(state.currentInput, commandNames)

      if (typeof result === "string") {
        setInput(result)
      } else if (Array.isArray(result)) {
        const entry: TerminalHistoryEntry = {
          input: state.currentInput,
          output: output(
            line(result.join("  "), "dimmed")
          ),
        }
        dispatch({ type: "SUBMIT_COMMAND", entry, raw: state.currentInput })
      }
      return
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === "u") {
        e.preventDefault()
        setInput("")
        return
      }
      if (e.key === "l") {
        e.preventDefault()
        clear()
        return
      }
      if (e.key === "c") {
        e.preventDefault()
        if (state.currentInput) {
          const entry: TerminalHistoryEntry = {
            input: state.currentInput + "^C",
            output: output(),
          }
          dispatch({ type: "SUBMIT_COMMAND", entry, raw: state.currentInput })
        }
        setInput("")
        return
      }
    }
  }

  return (
    <div className="flex items-center border-t border-border bg-bg-tertiary p-4 font-mono text-sm">
      <span className="mr-2 shrink-0">
        <span className="text-success">visitor</span>
        <span className="text-text-secondary">@orrevua</span>
        <span className="text-text-tertiary">:~$</span>
      </span>
      <input
        ref={inputRef}
        type="text"
        value={state.currentInput}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent text-text-primary caret-accent outline-none"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
    </div>
  )
}
