"use client"

import { useEffect, useRef } from "react"
import type { TerminalLine } from "@/types"
import { useTerminal } from "./terminal-provider"

const WELCOME_TEXT = [
  "Welcome to Felipe Franca's portfolio terminal.",
  "Type help to see available commands.",
  "",
]

function Prompt() {
  return (
    <span className="mr-2 shrink-0">
      <span className="text-success">visitor</span>
      <span className="text-text-secondary">@orrevua</span>
      <span className="text-text-tertiary">:~$</span>
    </span>
  )
}

function lineStyle(l: TerminalLine): string {
  const styles: Record<string, string> = {
    bold: "font-bold",
    dimmed: "text-text-tertiary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  }
  return l.style ? styles[l.style] ?? "text-text-primary" : "text-text-primary"
}

function OutputLine({ l }: { l: TerminalLine }) {
  if (l.isLink) {
    return (
      <div className="leading-relaxed">
        <a
          href={l.isLink.url}
          target={l.isLink.newTab ? "_blank" : undefined}
          rel={l.isLink.newTab ? "noopener noreferrer" : undefined}
          className="text-accent underline"
        >
          {l.content}
        </a>
      </div>
    )
  }

  return (
    <div className={`leading-relaxed whitespace-pre-wrap ${lineStyle(l)}`}>
      {l.content || " "}
    </div>
  )
}

export function TerminalBody() {
  const { state } = useTerminal()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [state.history.length])

  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
      {state.history.length === 0 && (
        <div className="mb-4 text-text-secondary">
          {WELCOME_TEXT.map((text, i) => (
            <div key={i} className="leading-relaxed">
              {text || " "}
            </div>
          ))}
        </div>
      )}

      {state.history.map((entry, i) => (
        <div key={i} className="mb-3">
          <div className="flex">
            <Prompt />
            <span className="text-text-primary">{entry.input}</span>
          </div>
          <div className="mt-1 ml-0">
            {entry.output.lines.map((l, j) => (
              <OutputLine key={j} l={l} />
            ))}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  )
}
