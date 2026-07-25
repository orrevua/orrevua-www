import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo, BASE_BRANCH } from "@/lib/github"
import {
  clientIp,
  enforceRateLimit,
  requireAdmin,
  requireSameOrigin,
} from "@/lib/blog/route-guards"
import {
  blogBranchName,
  validateBody,
  validateFrontmatter,
  validateImageBatch,
  validateSlug,
} from "@/lib/blog/validate"
import {
  commitBlogTree,
  getBaseSha,
  getBranchHeadSha,
  type TreeFile,
} from "@/lib/blog/git-tree"
import { buildMdxFile } from "@/lib/blog/mdx-file"
import { parseBlogBranch } from "@/lib/blog/validate"

export const runtime = "nodejs"

const CONTENT_DIR = "src/content/blog"
const MAX_PAYLOAD_BYTES = 15 * 1024 * 1024

type Payload = {
  originalSlug?: string
  slug: string
  date: string
  tags: string[]
  cover?: string
  en: { title: string; description: string; body: string }
  pt: { title: string; description: string; body: string }
  pendingImages?: Array<{ filename: string; mime: string; base64: string }>
  branchName?: string
}

export async function POST(req: NextRequest) {
  const authFail = requireAdmin(req)
  if (authFail) return authFail
  const originFail = requireSameOrigin(req)
  if (originFail) return originFail
  const rlFail = await enforceRateLimit(`blog:save:${clientIp(req)}`)
  if (rlFail) return rlFail

  try {
    const raw = await req.text()
    if (raw.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Payload exceeds 15 MiB." }, { status: 413 })
    }
    const body = JSON.parse(raw) as Payload
    const enFm = validateFrontmatter({
      slug: body.slug,
      title: body.en?.title,
      description: body.en?.description,
      date: body.date,
      tags: body.tags,
      cover: body.cover,
    })
    if (!enFm.valid) return NextResponse.json({ error: `EN: ${enFm.error}` }, { status: 400 })
    const ptFm = validateFrontmatter({
      slug: body.slug,
      title: body.pt?.title,
      description: body.pt?.description,
      date: body.date,
      tags: body.tags,
      cover: body.cover,
    })
    if (!ptFm.valid) return NextResponse.json({ error: `PT: ${ptFm.error}` }, { status: 400 })
    const enBody = validateBody(body.en?.body)
    if (!enBody.valid) return NextResponse.json({ error: `EN body: ${enBody.error}` }, { status: 400 })
    const ptBody = validateBody(body.pt?.body)
    if (!ptBody.valid) return NextResponse.json({ error: `PT body: ${ptBody.error}` }, { status: 400 })

    const imagesRes = validateImageBatch(body.pendingImages, [enBody.data, ptBody.data])
    if (!imagesRes.valid) return NextResponse.json({ error: imagesRes.error }, { status: 400 })

    const slug = enFm.data.slug
    const files: TreeFile[] = [
      { path: `${CONTENT_DIR}/${slug}/en.mdx`, content: buildMdxFile(enFm.data, enBody.data) },
      { path: `${CONTENT_DIR}/${slug}/pt.mdx`, content: buildMdxFile(ptFm.data, ptBody.data) },
    ]

    for (const img of imagesRes.data) {
      files.push({
        path: `public/blog/${slug}/${img.filename}`,
        content: img.buffer,
        encoding: "base64",
      })
    }

    let commitMessage = `feat(blog): save ${slug}`
    if (body.originalSlug && body.originalSlug !== slug) {
      const origRes = validateSlug(body.originalSlug)
      if (!origRes.valid) return NextResponse.json({ error: origRes.error }, { status: 400 })
      files.push(
        { path: `${CONTENT_DIR}/${origRes.data}/en.mdx`, content: null },
        { path: `${CONTENT_DIR}/${origRes.data}/pt.mdx`, content: null }
      )
      commitMessage = `feat(blog): rename ${origRes.data} → ${slug}`
    }

    if (body.branchName) {
      const parsed = parseBlogBranch(body.branchName)
      const expectedSlug = body.originalSlug ?? slug
      if (!parsed || parsed.kind !== "save" || parsed.slug !== expectedSlug) {
        return NextResponse.json(
          { error: "Invalid branch for update." },
          { status: 400 }
        )
      }
      const { data: prs } = await octokit.pulls.list({
        owner,
        repo,
        state: "open",
        head: `${owner}:${body.branchName}`,
      })
      const openPr = prs[0]
      if (!openPr || openPr.merged_at) {
        return NextResponse.json(
          { error: "No open PR for this branch." },
          { status: 409 }
        )
      }
      const branchHead = await getBranchHeadSha(body.branchName)
      await commitBlogTree({
        branchName: body.branchName,
        baseSha: branchHead,
        files,
        message: commitMessage,
        reuseExistingBranch: true,
      })
      return NextResponse.json(
        {
          prNumber: openPr.number,
          htmlUrl: openPr.html_url,
          branchName: body.branchName,
          previewUrl: null,
          updated: true,
        },
        { status: 200 }
      )
    }

    const branchName = blogBranchName(slug, "save")
    const baseSha = await getBaseSha()
    await commitBlogTree({ branchName, baseSha, files, message: commitMessage })

    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      title: commitMessage,
      body: `Automated blog CMS PR for \`${slug}\`.`,
      head: branchName,
      base: BASE_BRANCH,
    })

    return NextResponse.json(
      { prNumber: pr.number, htmlUrl: pr.html_url, branchName, previewUrl: null },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving blog post:", error)
    const message = error instanceof Error ? error.message : "Unknown error."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
