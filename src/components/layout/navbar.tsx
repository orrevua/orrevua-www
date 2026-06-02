"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useActiveSection } from "@/lib/hooks/use-active-section"

const NAV_ITEMS = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
] as const

const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeSection = useActiveSection(SECTION_IDS)

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
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`font-mono text-sm transition-colors ${
                    activeSection === item.id
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

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
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`font-mono text-sm transition-colors ${
                    activeSection === item.id
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
