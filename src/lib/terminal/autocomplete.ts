export function autocomplete(
  input: string,
  commands: string[]
): string | string[] | null {
  if (!input) return null

  const lower = input.toLowerCase()
  const matches = commands.filter((cmd) => cmd.toLowerCase().startsWith(lower))

  if (matches.length === 0) return null
  if (matches.length === 1) return matches[0]
  return matches
}
