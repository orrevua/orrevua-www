"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { experiences } from "@/data/experience"
import { SectionLabel } from "@/components/ui/section-label"
import { TechTag } from "@/components/ui/tech-tag"
import { useTranslation } from "@/i18n/context"

const careerEntries = experiences.filter((e) => !e.isPreCareer)

export function Experience() {
  const [expandedId, setExpandedId] = useState(careerEntries[0]?.id ?? "")
  const { t } = useTranslation()

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? "" : id))
  }

  return (
    <section id="experience" className="scroll-mt-20 py-30">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="02" label={t.experience.sectionLabel} />

        <div className="relative border-l-2 border-border pl-8">
          {careerEntries.map((entry) => {
            const isActive = expandedId === entry.id
            const translated = t.data.experiences[entry.id]
            const dateRange = entry.endDate
              ? `${entry.startDate} — ${entry.endDate}`
              : `${entry.startDate} — ${t.experience.present}`

            return (
              <div key={entry.id} className="relative mb-8 last:mb-0">
                <div
                  className={`absolute -left-9.75 top-1.5 h-3 w-3 rounded-full transition-colors ${
                    isActive ? "bg-accent" : "bg-border"
                  }`}
                />

                <button
                  className="group w-full text-left opacity-80 transition-opacity hover:opacity-100"
                  onClick={() => toggle(entry.id)}
                >
                  <h3 className="relative inline-block text-xl font-semibold text-text-primary">
                    <span className="pointer-events-none absolute inset-0 -inset-x-2 rounded opacity-0 blur-md bg-accent/5 transition-opacity group-hover:opacity-100" />
                    <span className="relative">{entry.company}</span>
                    {translated?.note && (
                      <span className="relative ml-2 text-sm font-normal text-text-tertiary">
                        ({translated.note})
                      </span>
                    )}
                  </h3>
                  <p className="font-mono text-sm text-accent">
                    {translated?.role ?? entry.role}
                  </p>
                  <p className="text-sm text-text-tertiary">{dateRange}</p>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <p className="text-sm text-text-secondary">
                          {translated?.description ?? entry.description}
                        </p>

                        <ul className="mt-3 space-y-1.5">
                          {(translated?.bullets ?? entry.bullets).map((bullet, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm text-text-secondary"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
                              {bullet}
                            </li>
                          ))}
                        </ul>

                        {entry.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {entry.technologies.map((tech) => (
                              <TechTag key={tech} name={tech} />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
