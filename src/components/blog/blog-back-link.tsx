"use client"

import Link from "next/link"
import { useTranslation } from "@/i18n/context"

export function BlogBackLink() {
  const { t } = useTranslation()
  return (
    <Link
      href="/blog"
      className="font-mono text-sm text-text-secondary transition-colors hover:text-accent"
    >
      {t.blog.backToBlog}
    </Link>
  )
}
