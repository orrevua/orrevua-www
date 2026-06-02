"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useTerminal } from "./terminal-provider"
import { TerminalChrome } from "./terminal-chrome"
import { TerminalBody } from "./terminal-body"
import { TerminalInput } from "./terminal-input"

export function TerminalOverlay() {
  const { isOpen, isMinimized, isMaximized, dispatch } = useTerminal()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => dispatch({ type: "CLOSE" })}
        >
          <motion.div
            className={`flex ${isMaximized ? "h-full" : "h-[75vh]"} w-full max-w-4xl flex-col overflow-hidden rounded-t-xl border-x border-t border-border bg-bg-tertiary shadow-2xl`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <TerminalChrome />
            <TerminalBody />
            <TerminalInput />
          </motion.div>
        </motion.div>
      )}
      {isMinimized && !isOpen && (
        <div className="fixed bottom-4 z-50 flex w-full justify-center">
          <button
            onClick={() => dispatch({ type: "OPEN" })}
            className="rounded-full border border-border bg-bg-secondary px-3 py-1 text-sm text-text-primary shadow-md"
            aria-label="Open terminal"
            title="Open terminal"
          >
            visitor@orrevua:~$
          </button>
        </div>
      )}
    </AnimatePresence>
  )
}
