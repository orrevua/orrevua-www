import { Octokit } from "@octokit/rest"

export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
export const owner = process.env.GITHUB_REPO_OWNER!
export const repo = process.env.GITHUB_REPO_NAME!
export const FEEDBACKS_PATH = "src/data/feedbacks.json"
export const BASE_BRANCH = "main"
