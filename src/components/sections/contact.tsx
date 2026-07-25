"use client"

import { personalInfo } from "@/data/personal"
import { SectionLabel } from "@/components/ui/section-label"
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons"
import { useTranslation } from "@/i18n/context"

export function Contact() {
  const { t } = useTranslation()
  const github = personalInfo.socials.find((s) => s.platform === "github")
  const linkedin = personalInfo.socials.find((s) => s.platform === "linkedin")

  return (
    <section id="contact" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="flex justify-center">
          <SectionLabel number="06" label={t.contact.sectionLabel} />
        </div>

        <h2 className="text-4xl font-bold text-text-primary">
          {t.contact.heading}
        </h2>

        <p className="mx-auto mt-4 max-w-md text-lg text-text-secondary">
          {t.contact.description}
        </p>

        <a
          href={`mailto:${personalInfo.email}`}
          className="mt-8 inline-block font-mono text-lg text-accent transition-colors hover:text-accent-hover"
        >
          {personalInfo.email}
        </a>

        <div className="mt-6">
          <a
            href="/freelance"
            className="inline-block rounded-lg border border-accent px-6 py-3 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-bg-primary"
          >
            {t.contact.freelanceCta}
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          {github && (
            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              <GitHubIcon size={22} />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={22} />
            </a>
          )}
        </div>

        <a
          href="/Felipe França - Resume.pdf"
          className="mt-6 inline-block font-mono text-sm text-text-tertiary transition-colors hover:text-text-secondary"
        >
          {t.contact.downloadResume}
        </a>
      </div>
    </section>
  )
}
