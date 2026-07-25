import { octokit, owner, repo, BASE_BRANCH } from "@/lib/github"

export type TreeFile =
  | { path: string; content: string; encoding?: "utf-8" }
  | { path: string; content: Buffer; encoding: "base64" }
  | { path: string; content: null }

export async function getBaseSha(): Promise<string> {
  const { data } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${BASE_BRANCH}`,
  })
  return data.object.sha
}

async function createTextBlob(content: string): Promise<string> {
  const { data } = await octokit.git.createBlob({
    owner,
    repo,
    content: Buffer.from(content, "utf-8").toString("base64"),
    encoding: "base64",
  })
  return data.sha
}

async function createBinaryBlob(content: Buffer): Promise<string> {
  const { data } = await octokit.git.createBlob({
    owner,
    repo,
    content: content.toString("base64"),
    encoding: "base64",
  })
  return data.sha
}

export async function getBranchHeadSha(branchName: string): Promise<string> {
  const { data } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
  })
  return data.object.sha
}

export async function commitBlogTree(params: {
  branchName: string
  baseSha: string
  files: TreeFile[]
  message: string
  reuseExistingBranch?: boolean
}): Promise<void> {
  const { branchName, baseSha, files, message, reuseExistingBranch } = params

  if (!reuseExistingBranch) {
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    })
  }

  const treeEntries = await Promise.all(
    files.map(async (f) => {
      if (f.content === null) {
        return {
          path: f.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: null,
        }
      }
      const sha =
        typeof f.content === "string"
          ? await createTextBlob(f.content)
          : await createBinaryBlob(f.content)
      return {
        path: f.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha,
      }
    })
  )

  const { data: tree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseSha,
    tree: treeEntries,
  })

  const { data: commit } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: tree.sha,
    parents: [baseSha],
  })

  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
    sha: commit.sha,
    force: false,
  })
}
