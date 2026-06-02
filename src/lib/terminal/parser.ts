export function parseInput(raw: string): { command: string; args: string[] } {
  const trimmed = raw.trim()
  if (!trimmed) return { command: "", args: [] }

  const tokens = trimmed.split(/\s+/)
  const command = tokens[0].toLowerCase()
  const args = tokens.slice(1)

  return { command, args }
}
