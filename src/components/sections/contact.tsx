import { personalInfo } from "@/data/personal"
import { SectionLabel } from "@/components/ui/section-label"
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons"

export function Contact() {
  const github = personalInfo.socials.find((s) => s.platform === "github")
  const linkedin = personalInfo.socials.find((s) => s.platform === "linkedin")

  return (
    <section id="contact" className="scroll-mt-20 py-30">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="flex justify-center">
          <SectionLabel number="05" label="contact" />
        </div>

        <h2 className="text-4xl font-bold text-text-primary">
          Let&apos;s connect
        </h2>

        <p className="mx-auto mt-4 max-w-md text-lg text-text-secondary">
          Open to conversations about engineering, architecture, or
          opportunities.
        </p>

        <a
          href={`mailto:${personalInfo.email}`}
          className="mt-8 inline-block font-mono text-lg text-accent transition-colors hover:text-accent-hover"
        >
          {personalInfo.email}
        </a>

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
          Download Resume &darr;
        </a>
      </div>
    </section>
  )
}
