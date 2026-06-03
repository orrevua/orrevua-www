"use client"

import { useState } from "react"
import Image from "next/image"
import { Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { personalInfo } from "@/data/personal"
import { useTerminal } from "@/components/terminal/terminal-provider"
import { ClaudeMascot } from "@/components/ui/claude-mascot"
import { useTranslation } from "@/i18n/context"

export function Hero() {
  const [imageError, setImageError] = useState(false)
  const { toggle } = useTerminal()
  const { t } = useTranslation()

  return (
    <>
    <section className="mx-auto flex max-h-[80vh] max-w-5xl items-center gap-12 px-6 pt-32 pb-20">
      <div className="flex-[3]">
        <motion.h1
          className="text-5xl font-bold text-text-primary lg:text-6xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {personalInfo.name}
        </motion.h1>

        <motion.p
          className="mt-3 font-mono text-sm text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t.data.personal.title}
          <span className="animate-blink ml-0.5 text-accent">▎</span>
        </motion.p>

        <motion.p
          className="mt-6 max-w-lg text-lg text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {t.data.personal.tagline}
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="#projects"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-bg-primary transition-colors hover:bg-accent-hover"
          >
            {t.hero.viewMyWork}
          </a>
          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-text-secondary transition-colors hover:border-accent hover:text-accent"
            title="Ctrl+`"
          >
            <Terminal size={16} />
            <span className="font-mono text-sm">Ctrl+`</span>
          </button>
        </motion.div>
      </div>

      <div className="hidden flex-2 justify-end lg:flex">
        {imageError ? (
          <div className="flex h-96 w-80 items-center justify-center rounded-2xl border border-border bg-bg-secondary">
            <span className="font-mono text-4xl text-text-tertiary">FF</span>
          </div>
        ) : (
          <Image
            src="/photo.png"
            alt={personalInfo.name}
            width={400}
            height={500}
            className="max-h-96 rounded-2xl border border-border object-cover"
            priority
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </section>

      <ClaudeMascot />
    </>
  )
}
