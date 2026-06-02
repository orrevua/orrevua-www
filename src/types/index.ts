export type SocialLink = {
  platform: "github" | "linkedin" | "email"
  url: string
  label: string
}

export type PersonalInfo = {
  name: string
  title: string
  tagline: string
  location: string
  experience: string
  focus: string
  education: string
  english: string
  status: string
  email: string
  socials: SocialLink[]
  aboutParagraphs: string[]
}

export type ExperienceEntry = {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string
  bullets: string[]
  technologies: string[]
  isPreCareer: boolean
  note?: string
}

export type Project = {
  id: string
  name: string
  displayName: string
  description: string
  longDescription: string
  technologies: string[]
  githubUrl: string
  liveUrl?: string
  isFeatured: boolean
}

export type SkillCategory = {
  name: string
  skills: string[]
}

export type TerminalLine = {
  content: string
  style?: "bold" | "dimmed" | "accent" | "success" | "warning" | "error"
  isLink?: { url: string; newTab: boolean }
}

export type TerminalOutput = {
  lines: TerminalLine[]
  staggered?: boolean
  staggerDelay?: number
}

export type TerminalCommand = {
  name: string
  description: string
  usage?: string
  execute: (args: string[]) => TerminalOutput
}

export type TerminalHistoryEntry = {
  input: string
  output: TerminalOutput
}

export type TerminalState = {
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  history: TerminalHistoryEntry[]
  commandHistory: string[]
  commandHistoryIndex: number
  currentInput: string
  cursorPosition: number
}
