import { useEffect } from "react"

export function useKeydown(
  key: string,
  ctrlKey: boolean,
  callback: () => void
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const modifierPressed = ctrlKey ? e.ctrlKey || e.metaKey : true
      const keyMatch =
        e.key === key || (key === "`" && e.code === "Backquote")

      if (keyMatch && modifierPressed) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [key, ctrlKey, callback])
}
