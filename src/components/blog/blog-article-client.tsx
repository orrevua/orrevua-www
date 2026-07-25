"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useTranslation } from "@/i18n/context"

type Props = {
  en: ReactNode
  pt: ReactNode
}

export function BlogArticleClient({ en, pt }: Props) {
  const { locale } = useTranslation()
  const enRef = useRef<HTMLElement>(null)
  const ptRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (enRef.current) enRef.current.hidden = locale !== "en"
    if (ptRef.current) ptRef.current.hidden = locale !== "pt"
  }, [locale])

  return (
    <>
      <article
        ref={enRef}
        data-locale="en"
        className="prose-blog"
        hidden={locale !== "en"}
      >
        {en}
      </article>
      <article
        ref={ptRef}
        data-locale="pt"
        className="prose-blog"
        hidden={locale !== "pt"}
      >
        {pt}
      </article>
    </>
  )
}
