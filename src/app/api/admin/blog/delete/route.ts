import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo, BASE_BRANCH } from "@/lib/github"
import {
  clientIp,
  enforceRateLimit,
  requireAdmin,
  requireSameOrigin,
} from "@/lib/blog/route-guards"
import { blogBranchName, validateSlug } from "@/lib/blog/validate"
import { commitBlogTree, getBaseSha } from "@/lib/blog/git-tree"

const CONTENT_DIR = "src/content/blog"

export async function POST(req: NextRequest) {
  const authFail = requireAdmin(req)
  if (authFail) return authFail
  const originFail = requireSameOrigin(req)
  if (originFail) return originFail
  const rlFail = await enforceRateLimit(`blog:delete:${clientIp(req)}`)
  if (rlFail) return rlFail

  try {
    const { slug } = (await req.json()) as { slug?: string }
    const slugRes = validateSlug(slug)
    if (!slugRes.valid) return NextResponse.json({ error: slugRes.error }, { status: 400 })

    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path: `${CONTENT_DIR}/${slugRes.data}/en.mdx`,
        ref: BASE_BRANCH,
      })
    } catch (err) {
      const is404 =
        err instanceof Error &&
        "status" in err &&
        (err as { status: number }).status === 404
      if (is404) return NextResponse.json({ error: "Post not found." }, { status: 404 })
      throw err
    }

    const branchName = blogBranchName(slugRes.data, "delete")
    const baseSha = await getBaseSha()
    const message = `chore(blog): delete ${slugRes.data}`
    await commitBlogTree({
      branchName,
      baseSha,
      files: [
        { path: `${CONTENT_DIR}/${slugRes.data}/en.mdx`, content: null },
        { path: `${CONTENT_DIR}/${slugRes.data}/pt.mdx`, content: null },
      ],
      message,
    })

    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      title: message,
      body: `Automated blog CMS delete PR for \`${slugRes.data}\`.`,
      head: branchName,
      base: BASE_BRANCH,
    })

    return NextResponse.json(
      { prNumber: pr.number, htmlUrl: pr.html_url, branchName },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error deleting blog post:", error)
    const message = error instanceof Error ? error.message : "Unknown error."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
