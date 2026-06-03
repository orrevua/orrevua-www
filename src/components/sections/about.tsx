"use client"

import { SectionLabel } from "@/components/ui/section-label"
import { LocationPreview } from "@/components/ui/location-preview"
import { useTranslation } from "@/i18n/context"

export function About() {
  const { t } = useTranslation()

  const snapshot = [
    { key: t.about.snapshotKeys.location, value: t.data.personal.location, isLocation: true },
    { key: t.about.snapshotKeys.experience, value: t.data.personal.experience },
    { key: t.about.snapshotKeys.focus, value: t.data.personal.focus },
    { key: t.about.snapshotKeys.education, value: t.data.personal.education },
    { key: t.about.snapshotKeys.english, value: t.data.personal.english },
    { key: t.about.snapshotKeys.status, value: t.data.personal.status, isStatus: true },
  ]

  return (
    <section id="about" className="scroll-mt-20 py-30">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="01" label={t.about.sectionLabel} />

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            {t.data.personal.aboutParagraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-text-secondary"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-bg-secondary p-6">
              <dl className="space-y-3">
                {snapshot.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-baseline justify-between gap-4 font-mono text-sm"
                  >
                    <dt className="text-text-tertiary">{item.key}</dt>
                    <dd className="text-right text-text-primary">
                      {item.isStatus && (
                        <span className="mr-1.5 text-success">●</span>
                      )}
                      {item.isLocation ? (
                        <LocationPreview
                          address={item.value}
                          embedUrl={
                            "https://maps.google.com/maps?q=Parnamirim,+RN&z=11&output=embed"
                          }
                          mapUrl={
                            "https://www.google.com/maps/place/Parnamirim,+RN"
                          }
                        />
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
