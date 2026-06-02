import { personalInfo } from "@/data/personal"
import { SectionLabel } from "@/components/ui/section-label"
import { LocationPreview } from "@/components/ui/location-preview"

const snapshot = [
  { key: "Location", value: personalInfo.location },
  { key: "Experience", value: personalInfo.experience },
  { key: "Focus", value: personalInfo.focus },
  { key: "Education", value: personalInfo.education },
  { key: "English", value: personalInfo.english },
  { key: "Status", value: personalInfo.status, isStatus: true },
]

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-30">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="01" label="about" />

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            {personalInfo.aboutParagraphs.map((paragraph, i) => (
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
                      {item.key === "Location" ? (
                        <LocationPreview
                          address={item.value}
                          // Use city-name query so Google highlights the city overview
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
