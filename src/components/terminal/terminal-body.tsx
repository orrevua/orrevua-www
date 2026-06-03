"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { TerminalLine, TerminalOutput as TerminalOutputType } from "@/types"
import { useTerminal } from "./terminal-provider"
import { useTranslation } from "@/i18n/context"

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
      {l.content || " "}
    </div>
  )
}

function StaggeredOutput({
  output,
  onLineReveal,
}: {
  output: TerminalOutputType
  onLineReveal?: () => void
}) {
  const [visibleCount, setVisibleCount] = useState(0)
  const delay = output.staggerDelay ?? 100

  useEffect(() => {
    if (visibleCount >= output.lines.length) return
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1)
      onLineReveal?.()
    }, delay)
    return () => clearTimeout(timer)
  }, [visibleCount, output.lines.length, delay, onLineReveal])

  return (
    <>
      {output.lines.slice(0, visibleCount).map((l, j) => (
        <OutputLine key={j} l={l} />
      ))}
      {visibleCount < output.lines.length && (
        <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
      )}
    </>
  )
}

export function TerminalBody() {
  const { state } = useTerminal()
  const { t } = useTranslation()
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [state.history.length, scrollToBottom])

  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
      {state.history.length === 0 && (
        <div className="mb-4 text-text-secondary">
          {t.terminal.welcome.map((text, i) => (
            <div key={i} className="leading-relaxed">
              {text || " "}
            </div>
          ))}
        </div>
      )}

      {state.history.map((entry, i) => {
        const isLast = i === state.history.length - 1

        return (
          <div key={i} className="mb-3">
            <div className="flex">
              <Prompt />
              <span className="text-text-primary">{entry.input}</span>
            </div>
            <div className="mt-1 ml-0">
              {isLast && entry.output.staggered ? (
                <StaggeredOutput
                  output={entry.output}
                  onLineReveal={scrollToBottom}
                />
              ) : (
                entry.output.lines.map((l, j) => (
                  <OutputLine key={j} l={l} />
                ))
              )}
            </div>
          </div>
        )
      })}

      <div ref={bottomRef} />
    </div>
  )
}
