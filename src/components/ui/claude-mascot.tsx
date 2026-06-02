"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTerminal } from "@/components/terminal/terminal-provider"

const CLAUDE_LOGO = [
  "     ▐▛███▜▌     ",
  "   ▝▜█████▛▘   ",
  "     ▘▘ ▝▝     ",
]

export function ClaudeMascot() {
  const [visible, setVisible] = useState(false)
  const { isOpen } = useTerminal()

  useEffect(() => {
    const delay = 15000 + Math.random() * 20000
    const timer = setTimeout(() => {
      if (!isOpen) setVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), 8000)
    return () => clearTimeout(timer)
  }, [visible])

  if (isOpen) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed right-6 bottom-6 z-40 flex items-end gap-3"
        >
          <div className="relative max-w-xs rounded-xl border border-border bg-bg-secondary px-4 py-3 shadow-lg">
            <p className="text-sm text-text-secondary">
              Psst... try typing{" "}
              <code className="rounded bg-bg-primary px-1.5 py-0.5 font-mono text-accent">
                agent
              </code>{" "}
              in the terminal
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              Press <kbd className="font-mono text-accent">Ctrl+`</kbd> to open
            </p>
            <div className="absolute -right-2 bottom-3 h-3 w-3 rotate-45 border-r border-b border-border bg-bg-secondary" />
          </div>

          <motion.button
            onClick={() => setVisible(false)}
            animate={{
              y: [0, -4, 0, -2, 0],
              rotate: [0, -3, 3, -2, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center justify-center rounded-xl border border-accent/30 bg-bg-secondary px-3 py-2 shadow-lg transition-colors hover:border-accent"
            aria-label="Dismiss hint"
          >
            <pre className="font-mono text-[8px] leading-2.5 text-accent select-none">
              {CLAUDE_LOGO.join("\n")}
            </pre>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
