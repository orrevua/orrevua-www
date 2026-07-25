import { NextRequest, NextResponse } from "next/server"
import matter from "gray-matter"
import { octokit, owner, repo, BASE_BRANCH } from "@/lib/github"
import {
  clientIp,
  requireAdmin,
  requireSameOrigin,
  tokenBucket,
} from "@/lib/blog/route-guards"
import { parseBlogBranch } from "@/lib/blog/validate"

const CONTENT_DIR = "src/content/blog"

async function readFrontmatter(slug: string, locale: "en" | "pt") {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: `${CONTENT_DIR}/${slug}/${locale}.mdx`,
      ref: BASE_BRANCH,
    })
    if (Array.isArray(data) || data.type !== "file") return null
    const content = Buffer.from(data.content, "base64").toString("utf-8")
    const parsed = matter(content)
    return parsed.data as { title?: string; tags?: string[]; date?: string }
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const authFail = requireAdmin(req)
  if (authFail) return authFail
  const originFail = requireSameOrigin(req)
  if (originFail) return originFail
  const bucketFail = tokenBucket(`blog:list:${clientIp(req)}`, 20, 5_000)
  if (bucketFail) return bucketFail

  try {
    let dirs: string[] = []
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: CONTENT_DIR,
        ref: BASE_BRANCH,
      })
      if (Array.isArray(data)) {
        dirs = data.filter((e) => e.type === "dir").map((e) => e.name).slice(0, 100)
      }
    } catch (err) {
      const is404 =
        err instanceof Error &&
        "status" in err &&
        (err as { status: number }).status === 404
      if (!is404) throw err
    }

    const posts = await Promise.all(
      dirs.map(async (slug) => {
        const [en, pt] = await Promise.all([
          readFrontmatter(slug, "en"),
          readFrontmatter(slug, "pt"),
        ])
        if (!en || !pt) return null
        return {
          slug,
          date: String(en.date ?? ""),
          titleEn: String(en.title ?? ""),
          titlePt: String(pt.title ?? ""),
          tags: Array.isArray(en.tags) ? en.tags.map(String) : [],
        }
      })
    )

    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      state: "open",
      per_page: 50,
    })

    const openPRs = pulls
      .map((pr) => {
        const parsed = parseBlogBranch(pr.head.ref)
        if (!parsed) return null
        return {
          prNumber: pr.number,
          branchName: pr.head.ref,
          slug: parsed.slug,
          action: parsed.kind,
          htmlUrl: pr.html_url,
          createdAt: pr.created_at,
        }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)

    return NextResponse.json({
      posts: posts.filter((p): p is NonNullable<typeof p> => p !== null),
      openPRs,
    })
  } catch (error) {
    console.error("Error listing blog posts:", error)
    return NextResponse.json({ error: "Failed to list blog posts." }, { status: 500 })
  }
}
