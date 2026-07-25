import type { BlogFrontmatter } from "@/types/blog"

function yamlString(value: string): string {
  return JSON.stringify(value)
}

export function buildMdxFile(fm: BlogFrontmatter, body: string): string {
  const lines: string[] = ["---"]
  lines.push(`slug: ${yamlString(fm.slug)}`)
  lines.push(`title: ${yamlString(fm.title)}`)
  lines.push(`description: ${yamlString(fm.description)}`)
  lines.push(`date: ${yamlString(fm.date)}`)
  const tags = fm.tags.map((t) => yamlString(t)).join(", ")
  lines.push(`tags: [${tags}]`)
  if (fm.cover) lines.push(`cover: ${yamlString(fm.cover)}`)
  lines.push("---")
  lines.push("")
  lines.push(body.endsWith("\n") ? body.slice(0, -1) : body)
  lines.push("")
  return lines.join("\n")
}
