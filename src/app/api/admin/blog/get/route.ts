import { NextRequest, NextResponse } from "next/server"
import matter from "gray-matter"
import { octokit, owner, repo, BASE_BRANCH } from "@/lib/github"
import { requireAdmin } from "@/lib/blog/route-guards"
import { parseBlogBranch, validateSlug } from "@/lib/blog/validate"

const CONTENT_DIR = "src/content/blog"

async function fetchLocale(slug: string, locale: "en" | "pt", ref: string) {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: `${CONTENT_DIR}/${slug}/${locale}.mdx`,
    ref,
  })
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error("Not a file.")
  }
  const raw = Buffer.from(data.content, "base64").toString("utf-8")
  const parsed = matter(raw)
  return { frontmatter: parsed.data, body: parsed.content }
}

export async function GET(req: NextRequest) {
  const authFail = requireAdmin(req)
  if (authFail) return authFail

  const slugParam = req.nextUrl.searchParams.get("slug")
  const refParam = req.nextUrl.searchParams.get("ref") ?? BASE_BRANCH

  const slugRes = validateSlug(slugParam)
  if (!slugRes.valid) {
    return NextResponse.json({ error: slugRes.error }, { status: 400 })
  }
  if (refParam !== BASE_BRANCH && !parseBlogBranch(refParam)) {
    return NextResponse.json({ error: "Invalid ref." }, { status: 400 })
  }

  try {
    const [en, pt] = await Promise.all([
      fetchLocale(slugRes.data, "en", refParam),
      fetchLocale(slugRes.data, "pt", refParam),
    ])
    return NextResponse.json({ slug: slugRes.data, ref: refParam, en, pt })
  } catch (err) {
    const is404 =
      err instanceof Error &&
      "status" in err &&
      (err as { status: number }).status === 404
    if (is404) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 })
    }
    console.error("Error fetching blog post:", err)
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 })
  }
}
