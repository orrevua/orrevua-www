"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Feedback } from "@/types"
import { SectionLabel } from "@/components/ui/section-label"
import { FeedbackForm } from "@/components/sections/feedback-form"
import { useTranslation } from "@/i18n/context"

type TestimonialsClientProps = {
  feedbacks: Feedback[]
}

export function TestimonialsClient({ feedbacks }: TestimonialsClientProps) {
  const { t, locale } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)

    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 24
      : 1
    setActiveIndex(Math.round(el.scrollLeft / cardWidth))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [updateScrollState, feedbacks.length])

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current
    if (!el || !el.firstElementChild) return
    const cardWidth = (el.firstElementChild as HTMLElement).offsetWidth + 24
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    })
  }

  const isCarousel = feedbacks.length > 2

  return (
    <section id="testimonials" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="05" label={t.testimonials.sectionLabel} />

        <h2 className="mb-8 text-3xl font-bold text-text-primary">
          {t.testimonials.heading}
        </h2>

        {feedbacks.length > 0 && (
          <div className="relative">
            {isCarousel && canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-bg-secondary p-2 text-text-secondary shadow-lg transition-colors hover:text-text-primary"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div
              ref={scrollRef}
              className={
                isCarousel
                  ? "flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none"
                  : "grid grid-cols-1 gap-6 md:grid-cols-2"
              }
            >
              {feedbacks.map((feedback) => {
                const localizedMessage =
                  locale === "pt"
                    ? feedback.messagePt ?? feedback.message
                    : feedback.messageEn ?? feedback.message

                return (
                  <div
                    key={feedback.id}
                    className={`rounded-xl border border-border bg-bg-secondary p-6 ${
                      isCarousel
                        ? "min-w-[min(100%,400px)] max-w-[400px] flex-shrink-0 snap-start"
                        : ""
                    }`}
                  >
                    <p className="italic text-text-secondary">
                      &ldquo;{localizedMessage}&rdquo;
                    </p>
                    <div className="mt-4">
                      <span className="font-medium text-text-primary">
                        {feedback.name}
                      </span>
                      <p className="font-mono text-sm text-accent">
                        {[feedback.role, feedback.company]
                          .filter(Boolean)
                          .join(" - ")}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {formatDate(feedback.date)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {isCarousel && canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-bg-secondary p-2 text-text-secondary shadow-lg transition-colors hover:text-text-primary"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {isCarousel && feedbacks.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {feedbacks.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i === activeIndex ? "bg-accent" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-12">
          <FeedbackForm />
        </div>
      </div>
    </section>
  )
}
