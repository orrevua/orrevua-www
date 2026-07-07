"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useActiveSection } from "@/lib/hooks/use-active-section"
import { useTranslation } from "@/i18n/context"
import { LanguageSwitch } from "@/components/ui/language-switch"
import { ThemeModeToggle } from "@/components/ui/theme-mode-toggle"

const NAV_IDS = [
  "about",
  "experience",
  "projects",
  "skills",
  "testimonials",
  "contact",
] as const

type NavId = (typeof NAV_IDS)[number]

const SECTION_IDS: string[] = [...NAV_IDS]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeSection = useActiveSection(SECTION_IDS)
  const { t } = useTranslation()

  const navLabels: Record<NavId, string> = {
    about: t.nav.about,
    experience: t.nav.experience,
    projects: t.nav.projects,
    skills: t.nav.skills,
    testimonials: t.nav.testimonials,
    contact: t.nav.contact,
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-mono font-semibold text-text-primary"
          onClick={() => setMobileOpen(false)}
        >
          orrevua
        </a>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`font-mono text-sm transition-colors ${
                    activeSection === id
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {navLabels[id]}
                </a>
              </li>
            ))}
          </ul>

          <ThemeModeToggle />
          <LanguageSwitch />

          <button
            className="text-text-secondary lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-bg-primary px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`font-mono text-sm transition-colors ${
                    activeSection === id
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {navLabels[id]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
