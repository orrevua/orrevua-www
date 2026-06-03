import { Octokit } from "@octokit/rest"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const octokit = new Octokit({ auth: requireEnv("GITHUB_TOKEN") })
export const owner = requireEnv("GITHUB_REPO_OWNER")
export const repo = requireEnv("GITHUB_REPO_NAME")
export const FEEDBACKS_PATH = "src/data/feedbacks.json"
export const BASE_BRANCH = "main"
