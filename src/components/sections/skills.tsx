"use client"

import { skillCategories } from "@/data/skills"
import { SectionLabel } from "@/components/ui/section-label"
import { TechTag } from "@/components/ui/tech-tag"
import { useTranslation } from "@/i18n/context"

const categoryKeyMap: Record<string, string> = {
  Languages: "languages",
  Backend: "backend",
  Frontend: "frontend",
  Databases: "databases",
  Infrastructure: "infrastructure",
  Practices: "practices",
}

export function Skills() {
  const { t } = useTranslation()

  return (
    <section id="skills" className="scroll-mt-20 py-30">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="04" label={t.skills.sectionLabel} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => {
            const key = categoryKeyMap[category.name] as keyof typeof t.skills.categories | undefined
            const translatedName = key ? t.skills.categories[key] : category.name

            return (
              <div
                key={category.name}
                className="rounded-xl border border-border bg-bg-secondary p-6"
              >
                <h3 className="mb-4 font-mono text-sm font-medium text-accent">
                  {translatedName}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <TechTag key={skill} name={skill} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
