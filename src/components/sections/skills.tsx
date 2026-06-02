import { skillCategories } from "@/data/skills"
import { SectionLabel } from "@/components/ui/section-label"
import { TechTag } from "@/components/ui/tech-tag"

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 py-30">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="04" label="skills" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <div
              key={category.name}
              className="rounded-xl border border-border bg-bg-secondary p-6"
            >
              <h3 className="mb-4 font-mono text-sm font-medium text-accent">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <TechTag key={skill} name={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
