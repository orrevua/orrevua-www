import type { TerminalLine, TerminalOutput, TerminalSegment } from "@/types"

export function header(text: string): TerminalOutput {
  return {
    lines: [
      { content: text, style: "accent" },
      { content: "═".repeat(text.length), style: "dimmed" },
    ],
  }
}

export function line(
  content: string,
  style?: TerminalLine["style"]
): TerminalLine {
  return style ? { content, style } : { content }
}

export function blank(): TerminalLine {
  return { content: "" }
}

export function link(label: string, url: string): TerminalLine {
  return { content: label, isLink: { url, newTab: true } }
}

export function table(rows: [string, string][]): TerminalLine[] {
  const maxKeyLen = Math.max(...rows.map(([k]) => k.length))
  return rows.map(([key, value]) => ({
    content: `${key.padEnd(maxKeyLen)}  ${value}`,
    style: "dimmed" as const,
  }))
}

export function output(...lines: TerminalLine[]): TerminalOutput {
  return { lines }
}

export function segmentedLine(
  segments: TerminalSegment[],
  fallback?: string
): TerminalLine {
  return {
    content: fallback ?? segments.map((s) => s.text).join(""),
    segments,
  }
}

export function combine(...outputs: TerminalOutput[]): TerminalOutput {
  return { lines: outputs.flatMap((o) => o.lines) }
}
