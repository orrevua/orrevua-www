"use client"

import { ExternalLink } from "lucide-react"
import { GitHubIcon } from "@/components/ui/icons"
import { PreviewCarousel } from "@/components/ui/preview-carousel"
import { projects } from "@/data/projects"
import { SectionLabel } from "@/components/ui/section-label"
import { TechTag } from "@/components/ui/tech-tag"
import { useTranslation } from "@/i18n/context"
import type { OgPreviews } from "@/lib/og"

export function Projects({ ogPreviews }: { ogPreviews: OgPreviews }) {
  const { t } = useTranslation()

  const featured = projects.filter((p) => p.isFeatured)
  const other = projects.filter((p) => !p.isFeatured)

  return (
    <section id="projects" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel number="03" label={t.projects.sectionLabel} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featured.map((project) => {
            const translated = t.data.projects[project.id]
            return (
              <div
                key={project.id}
                className="rounded-xl border border-border bg-bg-secondary p-6 transition hover:scale-[1.02] hover:border-accent/50"
              >
                {ogPreviews[project.id] && (
                  <PreviewCarousel
                    images={ogPreviews[project.id]}
                    alt={`${translated?.displayName ?? project.displayName} preview`}
                  />
                )}
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {translated?.displayName ?? project.displayName}
                  </h3>
                  {project.badge && (
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                      project.badge === "production"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-accent/30 bg-accent/10 text-accent"
                    }`}>
                      {project.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {translated?.description ?? project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <TechTag key={tech} name={tech} />
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-tertiary transition-colors hover:text-accent"
                      aria-label={`${translated?.displayName ?? project.displayName} on GitHub`}
                    >
                      <GitHubIcon size={18} />
                    </a>
                  ) : (
                    <span
                      className="cursor-default text-text-tertiary/40"
                      title="Private repository"
                    >
                      <GitHubIcon size={18} />
                    </span>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-tertiary transition-colors hover:text-accent"
                      aria-label={`${translated?.displayName ?? project.displayName} live site`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {other.length > 0 && (
          <div className="mt-8 space-y-3">
            {other.map((project) => {
              const translated = t.data.projects[project.id]
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg-secondary px-5 py-3"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-text-primary">
                      {translated?.displayName ?? project.displayName}
                    </span>
                    {project.badge && (
                      <span className={`ml-2 rounded-full border px-2 py-0.5 text-xs font-medium ${
                        project.badge === "production"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-accent/30 bg-accent/10 text-accent"
                      }`}>
                        {project.badge}
                      </span>
                    )}
                    <span className="ml-3 text-sm text-text-secondary">
                      {translated?.description ?? project.description}
                    </span>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tertiary transition-colors hover:text-accent"
                        aria-label={`${translated?.displayName ?? project.displayName} on GitHub`}
                      >
                        <GitHubIcon size={16} />
                      </a>
                    ) : (
                      <span
                        className="cursor-default text-text-tertiary/40"
                        title="Private repository"
                      >
                        <GitHubIcon size={16} />
                      </span>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tertiary transition-colors hover:text-accent"
                        aria-label={`${translated?.displayName ?? project.displayName} live site`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <a
          href="https://github.com/orrevua"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block font-mono text-sm text-accent transition-colors hover:text-accent-hover"
        >
          {t.projects.viewAllOnGithub}
        </a>
      </div>
    </section>
  )
}
