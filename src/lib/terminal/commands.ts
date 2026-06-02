import type { TerminalCommand, TerminalOutput } from "@/types"
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
} from "./formatter"

const registry = new Map<string, TerminalCommand>()

function register(cmd: TerminalCommand) {
  registry.set(cmd.name, cmd)
}

register({
  name: "help",
  description: "List all available commands",
  execute: () => {
    const unix = getAllCommands().filter((c) => !c.name.startsWith("/"))
    const portfolio = getAllCommands().filter((c) => c.name.startsWith("/"))

    const maxUnix = Math.max(...unix.map((c) => c.name.length))
    const maxPortfolio = Math.max(...portfolio.map((c) => c.name.length))

    const unixLines = unix.map((cmd) =>
      line(`  ${cmd.name.padEnd(maxUnix + 2)} ${cmd.description}`)
    )
    const portfolioLines = portfolio.map((cmd) =>
      line(`  ${cmd.name.padEnd(maxPortfolio + 2)} ${cmd.description}`)
    )

    return combine(
      header("Commands"),
      output(blank(), line("Shell", "accent"), ...unixLines, blank()),
      output(line("Portfolio", "accent"), ...portfolioLines, blank())
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
  execute: () => {
    return output(
      line("visitor — curious enough to open a terminal. I like you.", "success")
    )
  },
})

register({
  name: "history",
  description: "Show command history",
  execute: () => {
    return output(line("No history available.", "dimmed"))
  },
})

register({
  name: "sudo",
  description: "Superuser command",
  execute: (args) => {
    if (
      args.length >= 2 &&
      args[0].toLowerCase() === "hire" &&
      args[1].toLowerCase() === "felipe"
    ) {
      return output(
        line("┌─────────────────────────────────────────┐", "success"),
        line("│  ACCESS GRANTED                         │", "success"),
        line("│                                         │", "success"),
        line("│  Hiring sequence initiated...           │", "success"),
        line("│  Sending offer letter...                │", "success"),
        line("│  ████████████████████████████░░  93%    │", "success"),
        line("│                                         │", "success"),
        line("│  Just kidding. But let's talk!          │", "success"),
        line("│  → felipevictor67@gmail.com             │", "accent"),
        line("└─────────────────────────────────────────┘", "success")
      )
    }

    return output(line("Permission denied.", "error"))
  },
})

register({
  name: "rm",
  description: "Remove files",
  execute: () => {
    return output(line("Nice try. This portfolio is immutable.", "warning"))
  },
})

register({
  name: "vim",
  description: "Open vim editor",
  execute: () => {
    return output(
      line(
        "You're stuck now. Just kidding — there's no vim here. Type exit to leave.",
        "warning"
      )
    )
  },
})

register({
  name: "/about",
  description: "About Felipe Franca",
  execute: () => {
    const info = personalInfo
    const sections: TerminalOutput[] = [
      header(info.name),
      output(
        line(info.title, "accent"),
        line(info.tagline, "dimmed"),
        blank()
      ),
    ]

    for (const paragraph of info.aboutParagraphs) {
      sections.push(output(line(paragraph), blank()))
    }

    sections.push(
      output(
        line("Location      " + info.location, "dimmed"),
        line("Experience    " + info.experience, "dimmed"),
        line("Focus         " + info.focus, "dimmed"),
        line("Education     " + info.education, "dimmed"),
        line("English       " + info.english, "dimmed"),
        line("Status        " + info.status, "dimmed"),
      )
    )

    return combine(...sections)
  },
})

register({
  name: "/experience",
  description: "Professional experience",
  usage: "/experience [--all]",
  execute: (args) => {
    const showAll = args.includes("--all")
    const entries = showAll
      ? experiences
      : experiences.filter((e) => !e.isPreCareer)

    const lines = entries.flatMap((entry) => {
      const dateRange = entry.endDate
        ? `${entry.startDate} — ${entry.endDate}`
        : `${entry.startDate} — Present`
      const noteStr = entry.note ? ` (${entry.note})` : ""
      return [
        line(`▸ ${entry.company.padEnd(24)} ${entry.role}${noteStr}`, "accent"),
        line(`  ${dateRange}`, "dimmed"),
        line(`  ${entry.description}`),
        blank(),
      ]
    })

    return combine(
      header(showAll ? "Experience (All)" : "Experience"),
      output(...lines)
    )
  },
})

register({
  name: "/projects",
  description: "View projects",
  usage: "/projects [name]",
  execute: (args) => {
    if (args.length > 0) {
      const query = args.join(" ").toLowerCase()
      const project = projects.find(
        (p) =>
          p.id.toLowerCase() === query ||
          p.name.toLowerCase() === query ||
          p.displayName.toLowerCase() === query
      )

      if (!project) {
        return output(line(`Project not found: ${args.join(" ")}`, "error"))
      }

      const lines = [
        line(project.displayName, "accent"),
        blank(),
        line(project.longDescription),
        blank(),
        line(`Technologies: ${project.technologies.join(", ")}`, "dimmed"),
        link(`GitHub: ${project.githubUrl}`, project.githubUrl),
      ]

      if (project.liveUrl) {
        lines.push(link(`Live: ${project.liveUrl}`, project.liveUrl))
      }

      return output(...lines)
    }

    const featured = projects.filter((p) => p.isFeatured)
    const other = projects.filter((p) => !p.isFeatured)
    const sorted = [...featured, ...other]

    const lines = sorted.flatMap((project) => {
      const marker = project.isFeatured ? "★" : " "
      const result = [
        line(`${marker} ${project.displayName}`, "accent"),
        line(`  ${project.description}`),
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

    return combine(header("Projects"), output(...lines))
  },
})

register({
  name: "/skills",
  description: "Technical skills",
  execute: () => {
    const lines = skillCategories.flatMap((category) => [
      line(category.name, "accent"),
      line(`  ${category.skills.join(", ")}`),
      blank(),
    ])

    return combine(header("Skills"), output(...lines))
  },
})

register({
  name: "/contact",
  description: "Contact information",
  execute: () => {
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

    return combine(header("Contact"), output(...lines))
  },
})

register({
  name: "/github",
  description: "Open GitHub profile",
  execute: () => {
    const github = personalInfo.socials.find((s) => s.platform === "github")
    const url = github?.url ?? "https://github.com/orrevua"
    return output(
      line("Opening GitHub...", "success"),
      link(url, url)
    )
  },
})

register({
  name: "/linkedin",
  description: "Open LinkedIn profile",
  execute: () => {
    const linkedin = personalInfo.socials.find(
      (s) => s.platform === "linkedin"
    )
    const url = linkedin?.url ?? "https://linkedin.com/in/flpfranca"
    return output(
      line("Opening LinkedIn...", "success"),
      link(url, url)
    )
  },
})

register({
  name: "/resume",
  description: "Download resume",
  execute: () => {
    return output(line("Downloading resume...", "success"))
  },
})

register({
  name: "/stack",
  description: "Portfolio tech stack",
  execute: () => {
    return combine(
      header("Tech Stack"),
      output(
        line("This portfolio is built with:"),
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

register({
  name: "/theme",
  description: "Show color palette",
  execute: () => {
    const colors: [string, string][] = [
      ["bg-primary", "#0A0A0B"],
      ["bg-secondary", "#111113"],
      ["bg-tertiary", "#1A1A1F"],
      ["border", "#2A2A30"],
      ["text-primary", "#EDEDEF"],
      ["text-secondary", "#8A8A8E"],
      ["text-tertiary", "#5A5A5E"],
      ["accent", "#3B82F6"],
      ["success", "#22C55E"],
      ["warning", "#EAB308"],
      ["error", "#EF4444"],
    ]

    const lines = colors.map(([name, hex]) =>
      line(`  █████ ${hex}  ${name}`)
    )

    return combine(header("Color Palette"), output(...lines))
  },
})

const motdMessages = [
  "\"Clean code is not written by following a set of rules.\" — Robert C. Martin",
  "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" — Martin Fowler",
  "Felipe once built a relational DBMS from scratch in C++. For a university assignment.",
  "Fun fact: 'orrevua' is 'auverro' backwards. Which is also not a word. But it sounds cool.",
]

register({
  name: "/motd",
  description: "Message of the day",
  execute: () => {
    const dayIndex = Math.floor(Date.now() / 86400000)
    const msg = motdMessages[dayIndex % motdMessages.length]
    return output(blank(), line(msg, "accent"), blank())
  },
})

let historyProvider: (() => string[]) | null = null

export function setHistoryProvider(provider: () => string[]) {
  historyProvider = provider

  register({
    name: "history",
    description: "Show command history",
    execute: () => {
      const hist = historyProvider ? historyProvider() : []
      if (hist.length === 0) {
        return output(line("No commands in history.", "dimmed"))
      }
      const lines = hist.map((cmd, i) =>
        line(`  ${String(i + 1).padStart(3)}  ${cmd}`, "dimmed")
      )
      return combine(header("Command History"), output(...lines))
    },
  })
}

export function getCommand(name: string): TerminalCommand | undefined {
  return registry.get(name.toLowerCase())
}

export function getAllCommands(): TerminalCommand[] {
  return Array.from(registry.values())
}
