"use client"

import { marked } from "marked"
import TurndownService from "turndown"
import { sanitizeHtml } from "@/lib/admin/sanitize-html"

export function mdToHtml(md: string): string {
  const raw = marked.parse(md ?? "", { gfm: true, async: false }) as string
  return sanitizeHtml(raw)
}

function makeTurndown(slug: string): TurndownService {
  const td = new TurndownService({
    codeBlockStyle: "fenced",
    fence: "```",
    headingStyle: "atx",
    bulletListMarker: "-",
  })

  td.addRule("pendingImage", {
    filter: (node) => node.nodeName === "IMG" && node instanceof HTMLElement && node.hasAttribute("data-pending"),
    replacement: (_content, node) => {
      const el = node as HTMLElement
      const fn = el.getAttribute("data-pending") ?? ""
      const alt = el.getAttribute("alt") ?? ""
      return `![${alt}](/blog/${slug}/${fn})`
    },
  })

  return td
}

export function htmlToMd(html: string, slug: string): string {
  const cleaned = sanitizeHtml(html)
  return makeTurndown(slug).turndown(cleaned)
}

const NON_TRANSLATABLE_TAGS = new Set(["CODE", "PRE", "SCRIPT", "STYLE"])

function isTranslatableTextNode(node: Node): boolean {
  if (node.nodeType !== 3) return false
  const text = node.nodeValue ?? ""
  if (!text.trim()) return false
  let parent: Node | null = node.parentNode
  while (parent && parent.nodeType === 1) {
    if (NON_TRANSLATABLE_TAGS.has((parent as Element).tagName.toUpperCase())) {
      return false
    }
    parent = parent.parentNode
  }
  return true
}

export function extractTranslatableTexts(html: string): {
  texts: string[]
  doc: Document
  nodes: Text[]
} {
  const doc = new DOMParser().parseFromString(html || "<div></div>", "text/html")
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  const texts: string[] = []
  let node = walker.nextNode()
  while (node) {
    if (isTranslatableTextNode(node)) {
      nodes.push(node as Text)
      texts.push(node.nodeValue ?? "")
    }
    node = walker.nextNode()
  }
  return { texts, doc, nodes }
}

export function applyTranslatedTexts(
  doc: Document,
  nodes: Text[],
  translated: string[]
): string {
  for (let i = 0; i < nodes.length && i < translated.length; i++) {
    const original = nodes[i].nodeValue ?? ""
    const leading = original.match(/^\s*/)?.[0] ?? ""
    const trailing = original.match(/\s*$/)?.[0] ?? ""
    nodes[i].nodeValue = leading + (translated[i] ?? original).trim() + trailing
  }
  return doc.body.innerHTML
}
