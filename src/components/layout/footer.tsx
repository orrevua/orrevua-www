"use client"

import { Terminal } from "lucide-react"
import { useTranslation } from "@/i18n/context"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <p className="text-sm text-text-tertiary">
          {t.footer.copyright}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-tertiary">{t.footer.builtWith}</span>
          <span className="flex items-center gap-1 text-xs text-text-tertiary">
            <Terminal size={12} />
            Ctrl+`
          </span>
        </div>
      </div>
    </footer>
  )
}
