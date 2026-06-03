"use client"

import type { Feedback } from "@/types"
import { SectionLabel } from "@/components/ui/section-label"
import { FeedbackForm } from "@/components/sections/feedback-form"
import { useTranslation } from "@/i18n/context"

type TestimonialsClientProps = {
  feedbacks: Feedback[]
}

export function TestimonialsClient({ feedbacks }: TestimonialsClientProps) {
  const { t, locale } = useTranslation()

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "long",
      year: "numeric",
    })
  }

  return (
    <section id="testimonials" className="scroll-mt-20 py-30">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="05" label={t.testimonials.sectionLabel} />

        <h2 className="mb-8 text-3xl font-bold text-text-primary">
          {t.testimonials.heading}
        </h2>

        {feedbacks.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {feedbacks.map((feedback) => {
              const localizedMessage =
                locale === "pt"
                  ? feedback.messagePt ?? feedback.message
                  : feedback.messageEn ?? feedback.message

              return (
              <div
                key={feedback.id}
                className="rounded-xl border border-border bg-bg-secondary p-6"
              >
                <p className="italic text-text-secondary">
                  &ldquo;{localizedMessage}&rdquo;
                </p>
                <div className="mt-4">
                  <span className="font-medium text-text-primary">
                    {feedback.name}
                  </span>
                  <p className="font-mono text-sm text-accent">
                    {[feedback.role, feedback.company].filter(Boolean).join(" - ")}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {formatDate(feedback.date)}
                  </p>
                </div>
              </div>
              )
            })}
          </div>
        )}

        <div className="mt-12">
          <FeedbackForm />
        </div>
      </div>
    </section>
  )
}
