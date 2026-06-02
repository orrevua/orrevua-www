"use client"

import { useState } from "react"
import Image from "next/image"
import { Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { personalInfo } from "@/data/personal"
import { useTerminal } from "@/components/terminal/terminal-provider"
import { ClaudeMascot } from "@/components/ui/claude-mascot"

export function Hero() {
  const [imageError, setImageError] = useState(false)
  const { toggle } = useTerminal()

  return (
    <>
    <section className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-6 pt-32 pb-20 lg:flex-row lg:gap-12">
      <div className="flex-[3] text-center lg:text-left">
        <motion.h1
          className="text-4xl font-bold text-text-primary sm:text-5xl lg:text-6xl"
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
          {personalInfo.title}
          <span className="animate-blink ml-0.5 text-accent">▎</span>
        </motion.p>

        <motion.p
          className="mx-auto mt-6 max-w-lg text-lg text-text-secondary lg:mx-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {personalInfo.tagline}
        </motion.p>

        <motion.div
          className="mt-8 flex items-center justify-center gap-4 lg:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="#projects"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-bg-primary transition-colors hover:bg-accent-hover"
          >
            View my work
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

      <div className="flex flex-2 justify-center lg:justify-end">
        {imageError ? (
          <div className="flex h-52 w-44 items-center justify-center rounded-2xl border border-border bg-bg-secondary sm:h-72 sm:w-60 lg:h-96 lg:w-80">
            <span className="font-mono text-4xl text-text-tertiary">FF</span>
          </div>
        ) : (
          <Image
            src="/photo.png"
            alt={personalInfo.name}
            width={400}
            height={500}
            className="max-h-52 rounded-2xl border border-border object-cover sm:max-h-72 lg:max-h-96"
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
