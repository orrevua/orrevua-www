"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useTerminal } from "./terminal-provider"
import { TerminalChrome } from "./terminal-chrome"
import { TerminalBody } from "./terminal-body"
import { TerminalInput } from "./terminal-input"

export function TerminalOverlay() {
  const { isOpen, dispatch } = useTerminal()

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
            className="flex h-[75vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-xl border-x border-t border-border bg-bg-tertiary shadow-2xl"
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
    </AnimatePresence>
  )
}
