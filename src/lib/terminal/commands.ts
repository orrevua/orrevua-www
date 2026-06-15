import type { TerminalCommand, TerminalOutput } from "@/types"
import type { Translations } from "@/i18n/types"
import { personalInfo } from "@/data/personal"
import { experiences } from "@/data/experience"
import { projects } from "@/data/projects"
import { skillCategories } from "@/data/skills"
import {
  header,
  line,
  blank,
  link,
  output,
  combine,
  segmentedLine,
} from "./formatter"
import {
  themes,
  getThemeById,
  applyTheme,
  saveThemePreference,
  getSavedThemeId,
  resetTheme,
} from "@/lib/themes"
import type { ThemeDefinition, ThemePalette } from "@/lib/themes"

const registry = new Map<string, TerminalCommand>()

function register(cmd: TerminalCommand) {
  registry.set(cmd.name, cmd)
}

register({
  name: "help",
  description: "List all available commands",
  execute: (_args, t) => {
    const all = getAllCommands().filter((c) => !c.hidden)
    const unix = all.filter((c) => !c.name.startsWith("/") && c.name !== "sudo")
    const portfolio = all.filter((c) => c.name.startsWith("/"))

    const maxUnix = Math.max(...unix.map((c) => c.name.length))
    const maxPortfolio = Math.max(...portfolio.map((c) => c.name.length))

    const cmdDescs = t.terminal.commands
    const descMap: Record<string, string> = {
      help: cmdDescs.help,
      clear: cmdDescs.clear,
      exit: cmdDescs.exit,
      ls: cmdDescs.ls,
      whoami: cmdDescs.whoami,
      history: cmdDescs.history,
      sudo: cmdDescs.sudo,
      "sudo su": cmdDescs.sudoSu,
      rm: cmdDescs.rm,
      vim: cmdDescs.vim,
      "/about": cmdDescs.about,
      "/experience": cmdDescs.experience,
      "/projects": cmdDescs.projects,
      "/skills": cmdDescs.skills,
      "/contact": cmdDescs.contact,
      "/github": cmdDescs.github,
      "/linkedin": cmdDescs.linkedin,
      "/resume": cmdDescs.resume,
      "/stack": cmdDescs.stack,
      "/theme": cmdDescs.theme,
      "/themes": cmdDescs.themes,
      "/motd": cmdDescs.motd,
    }

    const unixLines = unix.map((cmd) =>
      line(`  ${cmd.name.padEnd(maxUnix + 2)} ${descMap[cmd.name] ?? cmd.description}`)
    )
    const portfolioLines = portfolio.map((cmd) =>
      line(`  ${cmd.name.padEnd(maxPortfolio + 2)} ${descMap[cmd.name] ?? cmd.description}`)
    )

    return combine(
      header(t.terminal.output.helpHeader),
      output(blank(), line(t.terminal.output.helpShell, "accent"), ...unixLines, blank()),
      output(line(t.terminal.output.helpPortfolio, "accent"), ...portfolioLines, blank())
    )
  },
})

register({
  name: "clear",
  description: "Clear terminal",
  execute: () => output(),
})

register({
  name: "exit",
  description: "Close terminal",
  execute: () => output(),
})

register({
  name: "ls",
  description: "List portfolio structure",
  execute: () => {
    const expEntries = experiences
      .filter((e) => !e.isPreCareer)
      .map((e, i, arr) => {
        const prefix = i === arr.length - 1 ? "│   └── " : "│   ├── "
        return line(`${prefix}${e.id}.yml`, "dimmed")
      })

    const projEntries = projects.map((p, i, arr) => {
      const prefix = i === arr.length - 1 ? "│   └── " : "│   ├── "
      return line(`${prefix}${p.name}/`, "dimmed")
    })

    const skillEntries = skillCategories.map((s, i, arr) => {
      const prefix = i === arr.length - 1 ? "│   └── " : "│   ├── "
      return line(`${prefix}${s.name.toLowerCase()}`, "dimmed")
    })

    return output(
      line("~/portfolio", "accent"),
      line("├── about/"),
      line("│   ├── bio.md", "dimmed"),
      line("│   └── snapshot.conf", "dimmed"),
      line("├── experience/"),
      ...expEntries,
      line("├── projects/"),
      ...projEntries,
      line("├── skills/"),
      ...skillEntries,
      line("├── contact.md"),
      line("└── resume.pdf"),
    )
  },
})

register({
  name: "whoami",
  description: "Who are you?",
  execute: (_args, t) => {
    return output(
      line(t.terminal.output.whoamiResponse, "success")
    )
  },
})

register({
  name: "history",
  description: "Show command history",
  execute: (_args, t) => {
    return output(line(t.terminal.output.noHistory, "dimmed"))
  },
})

register({
  name: "sudo",
  description: "Superuser command",
  execute: (args, t) => {
    if (args.length > 0 && args[0].toLowerCase() === "su") {
      const box = t.terminal.output.sudoBox
      return output(
        ...box.slice(0, -1).map((l) => line(l, "success")),
        line(box[box.length - 2] ?? "", "accent"),
        line(box[box.length - 1], "success")
      )
    }
    return output(line(t.terminal.output.permissionDenied, "error"))
  },
})

register({
  name: "sudo su",
  description: "Switch to superuser",
  execute: (_args, t) => {
    const box = t.terminal.output.sudoBox
    return output(
      ...box.slice(0, -1).map((l) => line(l, "success")),
      line(box[box.length - 2] ?? "", "accent"),
      line(box[box.length - 1], "success")
    )
  },
})

register({
  name: "rm",
  description: "Remove files",
  execute: (_args, t) => {
    return output(line(t.terminal.output.rmResponse, "warning"))
  },
})

register({
  name: "vim",
  description: "Open vim editor",
  execute: (_args, t) => {
    return output(line(t.terminal.output.vimResponse, "warning"))
  },
})

register({
  name: "neofetch",
  description: "",
  execute: (_args, t) => {
    const labels = t.terminal.output.neofetchLabels
    return output(
      blank(),
      line("        ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄        visitor@orrevua", "accent"),
      line("      ▄█████████████████▄      ─────────────────────"),
      line(`    ▄███████████████████████    ${labels.os}`),
      line(`   ████████████████████████▀   ${labels.host}`),
      line(`  ▐████████████████████████    ${labels.kernel}`),
      line(`  ████████████████████████▌    ${labels.shell}`),
      line(`  ████████████████████████▌    ${labels.wm}`),
      line(`  ▐███████████████████████▌    ${labels.terminal}`),
      line(`   ▀██████████████████████     ${labels.cpu}`),
      line(`    ▀████████████████████▀     ${labels.memory}`),
      line(`      ▀████████████████▀       ${labels.uptime}`),
      line(`        ▀▀▀▀▀▀▀▀▀▀▀▀▀▀        ${labels.packages}`),
      blank(),
      line("  █  █  █  █  █  █  █  █", "accent"),
      blank(),
    )
  },
})

register({
  name: "agent",
  description: "",
  execute: (_args, t) => {
    const a = t.terminal.output.agentLines
    const result = output(
      blank(),
      line(a.initializing, "accent"),
      blank(),
      line(a.architectAgent),
      line(a.analyzingVisitor, "dimmed"),
      line(a.readingPatterns, "dimmed"),
      line(a.draftingSpec, "dimmed"),
      line(a.specReady, "success"),
      line("└──────────────────────────────────────────────────┘"),
      blank(),
      line(a.implementerAgent),
      line(a.receivingSpec, "dimmed"),
      line(a.executingUnit, "dimmed"),
      line(a.runningChecks, "dimmed"),
      line(a.implementationComplete, "success"),
      line("└──────────────────────────────────────────────────┘"),
      blank(),
      line(a.reportTitle, "accent"),
      line(a.reportLine1),
      line(a.reportLine2),
      line(a.reportLine3),
      blank(),
      line(a.reportLine4),
      line(a.reportLine5),
      line(a.reportLine6),
      blank(),
      link("   → See how: github.com/orrevua/agentic-skills", "https://github.com/orrevua/agentic-skills"),
      blank(),
      line(a.reportCta1, "dimmed"),
      line(a.reportCta2, "dimmed"),
      link("   → felipevictor67@gmail.com", "mailto:felipevictor67@gmail.com"),
      blank(),
    )
    result.staggered = true
    result.staggerDelay = 120
    return result
  },
})

register({
  name: "/about",
  description: "About Felipe Franca",
  execute: (_args, t) => {
    const info = personalInfo
    const d = t.data.personal
    const labels = t.terminal.output.aboutLabels
    const sections: TerminalOutput[] = [
      header(info.name),
      output(
        line(d.title, "accent"),
        line(d.tagline, "dimmed"),
        blank()
      ),
    ]

    for (const paragraph of d.aboutParagraphs) {
      sections.push(output(line(paragraph), blank()))
    }

    sections.push(
      output(
        line(`${labels.location.padEnd(14)}${d.location}`, "dimmed"),
        line(`${labels.experience.padEnd(14)}${d.experience}`, "dimmed"),
        line(`${labels.focus.padEnd(14)}${d.focus}`, "dimmed"),
        line(`${labels.education.padEnd(14)}${d.education}`, "dimmed"),
        line(`${labels.english.padEnd(14)}${d.english}`, "dimmed"),
        line(`${labels.status.padEnd(14)}${d.status}`, "dimmed"),
      )
    )

    return combine(...sections)
  },
})

register({
  name: "/experience",
  description: "Professional experience",
  usage: "/experience [--all]",
  execute: (args, t) => {
    const showAll = args.includes("--all")
    const entries = showAll
      ? experiences
      : experiences.filter((e) => !e.isPreCareer)

    const lines = entries.flatMap((entry) => {
      const translated = t.data.experiences[entry.id]
      const dateRange = entry.endDate
        ? `${entry.startDate} — ${entry.endDate}`
        : `${entry.startDate} — ${t.experience.present}`
      const noteStr = translated?.note ? ` (${translated.note})` : entry.note ? ` (${entry.note})` : ""
      return [
        line(`▸ ${entry.company.padEnd(24)} ${translated?.role ?? entry.role}${noteStr}`, "accent"),
        line(`  ${dateRange}`, "dimmed"),
        line(`  ${translated?.description ?? entry.description}`),
        blank(),
      ]
    })

    return combine(
      header(showAll ? t.terminal.output.experienceAllHeader : t.terminal.output.experienceHeader),
      output(...lines)
    )
  },
})

register({
  name: "/projects",
  description: "View projects",
  usage: "/projects [name]",
  execute: (args, t) => {
    if (args.length > 0) {
      const query = args.join(" ").toLowerCase()
      const project = projects.find(
        (p) =>
          p.id.toLowerCase() === query ||
          p.name.toLowerCase() === query ||
          p.displayName.toLowerCase() === query
      )

      if (!project) {
        return output(line(t.terminal.output.projectNotFound.replace("{name}", args.join(" ")), "error"))
      }

      const translated = t.data.projects[project.id]
      const lines = [
        line(translated?.displayName ?? project.displayName, "accent"),
        blank(),
        line(translated?.longDescription ?? project.longDescription),
        blank(),
        line(`${t.terminal.output.technologies} ${project.technologies.join(", ")}`, "dimmed"),
      ]

      if (project.githubUrl) {
        lines.push(link(`GitHub: ${project.githubUrl}`, project.githubUrl))
      }

      if (project.liveUrl) {
        lines.push(link(`Live: ${project.liveUrl}`, project.liveUrl))
      }

      return output(...lines)
    }

    const featured = projects.filter((p) => p.isFeatured)
    const other = projects.filter((p) => !p.isFeatured)
    const sorted = [...featured, ...other]

    const lines = sorted.flatMap((project) => {
      const translated = t.data.projects[project.id]
      const marker = project.isFeatured ? "★" : " "
      const result = [
        line(`${marker} ${translated?.displayName ?? project.displayName}`, "accent"),
        line(`  ${translated?.description ?? project.description}`),
        line(`  ${project.technologies.join(" · ")}`, "dimmed"),
      ]

      const links: string[] = []
      if (project.githubUrl) links.push(project.githubUrl)
      if (project.liveUrl) links.push(project.liveUrl)
      if (links.length > 0) {
        result.push(line(`  ${links.join("  |  ")}`, "dimmed"))
      }

      result.push(blank())
      return result
    })

    return combine(header(t.terminal.output.projectsHeader), output(...lines))
  },
})

register({
  name: "/skills",
  description: "Technical skills",
  execute: (_args, t) => {
    const categoryKeyMap: Record<string, keyof Translations["skills"]["categories"]> = {
      Languages: "languages",
      Backend: "backend",
      Frontend: "frontend",
      Databases: "databases",
      Infrastructure: "infrastructure",
      Practices: "practices",
    }

    const lines = skillCategories.flatMap((category) => {
      const key = categoryKeyMap[category.name]
      const name = key ? t.skills.categories[key] : category.name
      return [
        line(name, "accent"),
        line(`  ${category.skills.join(", ")}`),
        blank(),
      ]
    })

    return combine(header(t.terminal.output.skillsHeader), output(...lines))
  },
})

register({
  name: "/contact",
  description: "Contact information",
  execute: (_args, t) => {
    const info = personalInfo
    const github = info.socials.find((s) => s.platform === "github")
    const linkedin = info.socials.find((s) => s.platform === "linkedin")

    const lines = [
      link(`Email: ${info.email}`, `mailto:${info.email}`),
    ]

    if (github) {
      lines.push(link(`GitHub: ${github.url}`, github.url))
    }
    if (linkedin) {
      lines.push(link(`LinkedIn: ${linkedin.url}`, linkedin.url))
    }

    return combine(header(t.terminal.output.contactHeader), output(...lines))
  },
})

register({
  name: "/github",
  description: "Open GitHub profile",
  execute: (_args, t) => {
    const github = personalInfo.socials.find((s) => s.platform === "github")
    const url = github?.url ?? "https://github.com/orrevua"
    return output(
      line(t.terminal.output.githubOpening, "success"),
      link(url, url)
    )
  },
})

register({
  name: "/linkedin",
  description: "Open LinkedIn profile",
  execute: (_args, t) => {
    const linkedin = personalInfo.socials.find(
      (s) => s.platform === "linkedin"
    )
    const url = linkedin?.url ?? "https://linkedin.com/in/flpfranca"
    return output(
      line(t.terminal.output.linkedinOpening, "success"),
      link(url, url)
    )
  },
})

register({
  name: "/admin",
  description: "Open admin panel",
  hidden: true,
  execute: (_args, t) => {
    if (typeof window !== "undefined") {
      window.open("/admin", "_blank")
    }
    return output(line(t.terminal.output.adminOpening, "success"), link("/admin", "/admin"))
  },
})

register({
  name: "/resume",
  description: "Download resume",
  execute: (_args, t) => {
    return output(line(t.terminal.output.resumeDownloading, "success"))
  },
})

register({
  name: "/stack",
  description: "Portfolio tech stack",
  execute: (_args, t) => {
    return combine(
      header(t.terminal.output.stackHeader),
      output(
        line(t.terminal.output.stackIntro),
        blank(),
        line("  Next.js 16", "accent"),
        line("  TypeScript", "accent"),
        line("  Tailwind CSS 4", "accent"),
        line("  Framer Motion", "accent"),
        line("  Vercel", "accent")
      )
    )
  },
})

function buildPaletteOutput(theme: ThemeDefinition, t: Translations): TerminalOutput {
  const displayColors: [string, keyof ThemePalette][] = [
    ["bg-primary", "--bg-primary"],
    ["bg-secondary", "--bg-secondary"],
    ["bg-tertiary", "--bg-tertiary"],
    ["border", "--border"],
    ["text-primary", "--text-primary"],
    ["text-secondary", "--text-secondary"],
    ["text-tertiary", "--text-tertiary"],
    ["accent", "--accent"],
    ["success", "--success"],
    ["warning", "--warning"],
    ["error", "--error"],
  ]

  const lines = displayColors.map(([label, varName]) => {
    const hex = theme.palette[varName]
    return segmentedLine([
      { text: "  █████ ", color: hex },
      { text: `${hex}  ${label}` },
    ])
  })

  return combine(
    header(`${t.terminal.output.themeHeader} (${theme.name})`),
    output(...lines)
  )
}

register({
  name: "/theme",
  description: "Show color palette",
  usage: "/theme [apply <name> | reset]",
  execute: (args, t) => {
    if (args[0]?.toLowerCase() === "apply" && args[1]) {
      const name = args.slice(1).join("-").toLowerCase()
      const theme = getThemeById(name)
      if (!theme) {
        return output(
          line(t.terminal.output.themeNotFound.replace("{name}", args.slice(1).join(" ")), "error"),
          line(t.terminal.output.themeUsage, "dimmed")
        )
      }
      applyTheme(theme)
      saveThemePreference(theme.id)
      return combine(
        output(line(t.terminal.output.themeApplied.replace("{name}", theme.name), "success")),
        buildPaletteOutput(theme, t)
      )
    }

    if (args[0]?.toLowerCase() === "reset") {
      resetTheme()
      saveThemePreference("midnight")
      const midnight = getThemeById("midnight")!
      return combine(
        output(line(t.terminal.output.themeReset, "success")),
        buildPaletteOutput(midnight, t)
      )
    }

    const currentId = getSavedThemeId()
    const theme = getThemeById(currentId) ?? getThemeById("midnight")!
    return buildPaletteOutput(theme, t)
  },
})

register({
  name: "/themes",
  description: "List available themes",
  execute: (_args, t) => {
    const currentId = getSavedThemeId()
    const lines = themes.flatMap((theme) => {
      const isCurrent = theme.id === currentId
      const marker = isCurrent ? ` ${t.terminal.output.themeCurrent}` : ""
      return [
        segmentedLine([
          { text: "  ● ", color: theme.palette["--accent"] },
          { text: `${theme.name}${marker}` },
        ]),
        line(`    ${theme.description}`, "dimmed"),
        blank(),
      ]
    })

    return combine(
      header(t.terminal.output.themesHeader),
      output(...lines, line(t.terminal.output.themeUsage, "dimmed"))
    )
  },
})

register({
  name: "/motd",
  description: "Message of the day",
  execute: (_args, t) => {
    const dayIndex = Math.floor(Date.now() / 86400000)
    const msg = t.terminal.motd[dayIndex % t.terminal.motd.length]
    return output(blank(), line(msg, "accent"), blank())
  },
})

let historyProvider: (() => string[]) | null = null

export function setHistoryProvider(provider: () => string[]) {
  historyProvider = provider

  register({
    name: "history",
    description: "Show command history",
    execute: (_args, t) => {
      const hist = historyProvider ? historyProvider() : []
      if (hist.length === 0) {
        return output(line(t.terminal.output.noCommandsHistory, "dimmed"))
      }
      const lines = hist.map((cmd, i) =>
        line(`  ${String(i + 1).padStart(3)}  ${cmd}`, "dimmed")
      )
      return combine(header(t.terminal.output.commandHistoryHeader), output(...lines))
    },
  })
}

export function getCommand(name: string): TerminalCommand | undefined {
  return registry.get(name.toLowerCase())
}

export function getAllCommands(): TerminalCommand[] {
  return Array.from(registry.values())
}
