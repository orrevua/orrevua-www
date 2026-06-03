"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react"
import type { TerminalState, TerminalHistoryEntry } from "@/types"
import { parseInput } from "@/lib/terminal/parser"
import { getCommand, setHistoryProvider } from "@/lib/terminal/commands"
import { output, line } from "@/lib/terminal/formatter"
import { personalInfo } from "@/data/personal"
import { useTranslation } from "@/i18n/context"

type Action =
  | { type: "TOGGLE" }
  | { type: "MINIMIZE" }
  | { type: "MAXIMIZE" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SUBMIT_COMMAND"; entry: TerminalHistoryEntry; raw: string }
  | { type: "SET_INPUT"; input: string }
  | { type: "CLEAR" }
  | { type: "NAVIGATE_HISTORY_UP" }
  | { type: "NAVIGATE_HISTORY_DOWN" }

const initialState: TerminalState = {
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  history: [],
  commandHistory: [],
  commandHistoryIndex: -1,
  currentInput: "",
  cursorPosition: 0,
}

function reducer(state: TerminalState, action: Action): TerminalState {
  switch (action.type) {
    case "TOGGLE":
      if (state.isMinimized) {
        return { ...state, isMinimized: false, isOpen: true }
      }
      return { ...state, isOpen: !state.isOpen }
    case "MINIMIZE":
      return { ...state, isMinimized: true, isOpen: false }
    case "MAXIMIZE":
      if (state.isMaximized) {
        return { ...state, isMaximized: false }
      }
      return { ...state, isMinimized: false, isOpen: true, isMaximized: true }
    case "OPEN":
      return { ...state, isOpen: true, isMinimized: false, isMaximized: false }
    case "CLOSE":
      return { ...state, isOpen: false, isMinimized: false, isMaximized: false }
    case "SUBMIT_COMMAND":
      return {
        ...state,
        history: [...state.history, action.entry],
        commandHistory: [...state.commandHistory, action.raw].slice(-100),
        commandHistoryIndex: -1,
        currentInput: "",
        cursorPosition: 0,
      }
    case "SET_INPUT":
      return {
        ...state,
        currentInput: action.input,
        cursorPosition: action.input.length,
      }
    case "CLEAR":
      return {
        ...state,
        history: [],
        commandHistoryIndex: -1,
        currentInput: "",
        cursorPosition: 0,
      }
    case "NAVIGATE_HISTORY_UP": {
      if (state.commandHistory.length === 0) return state
      const nextIndex =
        state.commandHistoryIndex === -1
          ? state.commandHistory.length - 1
          : Math.max(0, state.commandHistoryIndex - 1)
      const cmd = state.commandHistory[nextIndex]
      return {
        ...state,
        commandHistoryIndex: nextIndex,
        currentInput: cmd,
        cursorPosition: cmd.length,
      }
    }
    case "NAVIGATE_HISTORY_DOWN": {
      if (state.commandHistoryIndex === -1) return state
      const nextIndex = state.commandHistoryIndex + 1
      if (nextIndex >= state.commandHistory.length) {
        return {
          ...state,
          commandHistoryIndex: -1,
          currentInput: "",
          cursorPosition: 0,
        }
      }
      const cmd = state.commandHistory[nextIndex]
      return {
        ...state,
        commandHistoryIndex: nextIndex,
        currentInput: cmd,
        cursorPosition: cmd.length,
      }
    }
    default:
      return state
  }
}

type TerminalContextValue = {
  state: TerminalState
  dispatch: React.Dispatch<Action>
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  toggle: () => void
  submitCommand: (input: string) => void
  setInput: (input: string) => void
  navigateUp: () => void
  navigateDown: () => void
  clear: () => void
}

const TerminalContext = createContext<TerminalContextValue | null>(null)

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { t } = useTranslation()

  useEffect(() => {
    setHistoryProvider(() => state.commandHistory)
  }, [state.commandHistory])

  const toggle = useCallback(() => dispatch({ type: "TOGGLE" }), [])

  const setInput = useCallback(
    (input: string) => dispatch({ type: "SET_INPUT", input }),
    []
  )

  const navigateUp = useCallback(
    () => dispatch({ type: "NAVIGATE_HISTORY_UP" }),
    []
  )

  const navigateDown = useCallback(
    () => dispatch({ type: "NAVIGATE_HISTORY_DOWN" }),
    []
  )

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), [])

  const submitCommand = useCallback((input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return

    const { command, args } = parseInput(trimmed)

    if (command === "clear" || command === "/clear") {
      dispatch({ type: "CLEAR" })
      dispatch({ type: "SET_INPUT", input: "" })
      return
    }

    if (command === "exit" || command === "/exit") {
      dispatch({ type: "CLOSE" })
      return
    }

    const cmd = getCommand(command)

    if (!cmd) {
      const entry: TerminalHistoryEntry = {
        input: trimmed,
        output: output(
          line(
            t.terminal.commandNotFound.replace("{command}", command),
            "error"
          )
        ),
      }
      dispatch({ type: "SUBMIT_COMMAND", entry, raw: trimmed })
      return
    }

    if (command === "/github" && typeof window !== "undefined") {
      const s = personalInfo.socials.find((s) => s.platform === "github")
      window.open(s?.url ?? "https://github.com/orrevua", "_blank")
    }

    if (command === "/linkedin" && typeof window !== "undefined") {
      const s = personalInfo.socials.find((s) => s.platform === "linkedin")
      window.open(s?.url ?? "https://linkedin.com/in/flpfranca", "_blank")
    }

    if (command === "/resume" && typeof window !== "undefined") {
      const a = document.createElement("a")
      a.href = "/Felipe França - Resume.pdf"
      a.download = "Felipe França - Resume.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    const result = cmd.execute(args, t)
    const entry: TerminalHistoryEntry = {
      input: trimmed,
      output: result,
    }
    dispatch({ type: "SUBMIT_COMMAND", entry, raw: trimmed })
  }, [t])

  return (
    <TerminalContext.Provider
      value={{
        state,
        dispatch,
        isOpen: state.isOpen,
        isMinimized: state.isMinimized,
        isMaximized: state.isMaximized,
        toggle,
        submitCommand,
        setInput,
        navigateUp,
        navigateDown,
        clear,
      }}
    >
      {children}
    </TerminalContext.Provider>
  )
}

export function useTerminal(): TerminalContextValue {
  const ctx = useContext(TerminalContext)
  if (!ctx) {
    throw new Error("useTerminal must be used within a TerminalProvider")
  }
  return ctx
}
