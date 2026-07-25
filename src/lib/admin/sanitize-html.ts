const REMOVE_TAGS = new Set([
  "SCRIPT",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "LINK",
  "META",
  "STYLE",
  "BASE",
  "FORM",
  "INPUT",
  "BUTTON",
  "TEXTAREA",
  "SELECT",
])

const URL_ATTRS = new Set(["href", "src", "xlink:href", "formaction", "action"])
const DANGEROUS_URL_RE = /^\s*(javascript|vbscript):/i
const DATA_URL_RE = /^\s*data:/i
const SAFE_DATA_IMAGE_RE = /^\s*data:image\/(png|jpeg|webp);base64,/i

function isDangerousUrl(value: string, tagName: string, attrName: string): boolean {
  if (DANGEROUS_URL_RE.test(value)) return true
  if (DATA_URL_RE.test(value)) {
    if (tagName === "IMG" && attrName === "src" && SAFE_DATA_IMAGE_RE.test(value)) {
      return false
    }
    return true
  }
  return false
}

function scrubElement(el: Element): void {
  const tagName = el.tagName.toUpperCase()
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name
    if (name.toLowerCase().startsWith("on")) {
      el.removeAttribute(name)
      continue
    }
    if (name.toLowerCase() === "srcdoc") {
      el.removeAttribute(name)
      continue
    }
    if (URL_ATTRS.has(name.toLowerCase()) && isDangerousUrl(attr.value, tagName, name.toLowerCase())) {
      el.removeAttribute(name)
    }
  }
}

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return ""
  const doc = new DOMParser().parseFromString(html, "text/html")
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)
  const toRemove: Element[] = []
  let node: Node | null = walker.currentNode
  while (node) {
    if (node instanceof Element) {
      if (REMOVE_TAGS.has(node.tagName.toUpperCase())) {
        toRemove.push(node)
      } else {
        scrubElement(node)
      }
    }
    node = walker.nextNode()
  }
  for (const el of toRemove) el.remove()
  return doc.body.innerHTML
}
