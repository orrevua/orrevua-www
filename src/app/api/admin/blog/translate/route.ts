import { NextRequest, NextResponse } from "next/server"
import {
  clientIp,
  enforceRateLimit,
  requireAdmin,
  requireSameOrigin,
} from "@/lib/blog/route-guards"
import { translateBlock } from "@/lib/translate"

const MAX_TITLE = 200
const MAX_DESCRIPTION = 400
const MAX_TEXTS = 400
const MAX_TEXT_LENGTH = 2_000
const MAX_TOTAL_TEXT = 20_000

export async function POST(req: NextRequest) {
  const authFail = requireAdmin(req)
  if (authFail) return authFail
  const originFail = requireSameOrigin(req)
  if (originFail) return originFail
  const rlFail = await enforceRateLimit(`blog:translate:${clientIp(req)}`)
  if (rlFail) return rlFail

  try {
    const { title, description, texts, from, to } = (await req.json()) as {
      title?: string
      description?: string
      texts?: unknown
      from?: string
      to?: string
    }
    if (typeof title !== "string" || typeof description !== "string") {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 })
    }
    if (from !== "en" || to !== "pt") {
      return NextResponse.json({ error: "Only en → pt supported." }, { status: 400 })
    }
    if (title.length > MAX_TITLE || description.length > MAX_DESCRIPTION) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 })
    }
    const textArr =
      Array.isArray(texts) && texts.every((t) => typeof t === "string")
        ? (texts as string[])
        : []
    if (textArr.length > MAX_TEXTS) {
      return NextResponse.json({ error: "Too many text nodes." }, { status: 413 })
    }
    let total = 0
    for (const t of textArr) {
      if (t.length > MAX_TEXT_LENGTH) {
        return NextResponse.json({ error: "Text node too large." }, { status: 413 })
      }
      total += t.length
    }
    if (total > MAX_TOTAL_TEXT) {
      return NextResponse.json({ error: "Total text too large." }, { status: 413 })
    }

    const [titleT, descriptionT, ...translatedTexts] = await Promise.all([
      translateBlock(title, from, to),
      translateBlock(description, from, to),
      ...textArr.map((t) => translateBlock(t, from, to)),
    ])

    return NextResponse.json({
      title: titleT,
      description: descriptionT,
      texts: translatedTexts,
    })
  } catch (error) {
    console.error("Error translating blog post:", error)
    return NextResponse.json({ error: "Translation failed." }, { status: 500 })
  }
}
