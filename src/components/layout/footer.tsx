import { Terminal } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <p className="text-sm text-text-tertiary">
          &copy; 2026 Felipe Franca
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-tertiary">Built with Next.js</span>
          <span className="flex items-center gap-1 text-xs text-text-tertiary">
            <Terminal size={12} />
            Ctrl+T
          </span>
        </div>
      </div>
    </footer>
  )
}
