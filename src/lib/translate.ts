import { detect } from "tinyld"

const MYMEMORY_API = "https://api.mymemory.translated.net/get"

type TranslationResult = {
  messageEn: string
  messagePt: string
}

const MAX_QUERY_LENGTH = 480

async function translateChunk(
  text: string,
  from: string,
  to: string
): Promise<string> {
  const url = new URL(MYMEMORY_API)
  url.searchParams.set("q", text)
  url.searchParams.set("langpair", `${from}|${to}`)

  const res = await fetch(url.toString())
  if (!res.ok) return text

  const data = await res.json()
  const translated = data?.responseData?.translatedText
  if (!translated || data?.responseStatus !== 200) return text

  return translated
}

function splitIntoChunks(text: string): string[] {
  if (text.length <= MAX_QUERY_LENGTH) return [text]

  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  let current = ""

  for (const sentence of sentences) {
    if (current && (current + " " + sentence).length > MAX_QUERY_LENGTH) {
      chunks.push(current)
      current = sentence
    } else {
      current = current ? current + " " + sentence : sentence
    }
  }
  if (current) chunks.push(current)
  return chunks
}

async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  const chunks = splitIntoChunks(text)
  const translated = await Promise.all(
    chunks.map((chunk) => translateChunk(chunk, from, to))
  )
  return translated.join(" ")
}

function detectLanguage(text: string): "en" | "pt" {
  const lang = detect(text)
  return lang === "pt" ? "pt" : "en"
}

export async function translateFeedback(
  message: string
): Promise<TranslationResult> {
  const detected = detectLanguage(message)

  try {
    if (detected === "pt") {
      const messageEn = await translateText(message, "pt", "en")
      return { messageEn, messagePt: message }
    } else {
      const messagePt = await translateText(message, "en", "pt")
      return { messageEn: message, messagePt }
    }
  } catch {
    return { messageEn: message, messagePt: message }
  }
}
