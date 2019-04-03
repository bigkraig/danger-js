import { debug } from "../../debug"
import { GitLabUser } from "../../dsl/GitLabDSL"
import { api as fetch } from "../../api/fetch"
import * as node_fetch from "node-fetch"
import { Env } from "../../ci_source/ci_source"

import pLimit from "p-limit"
import { RepoMetaData } from "../../dsl/BitBucketServerDSL"

const limit = pLimit(25)

export interface GitLabSettings {
  baseUrl: string
  token?: string
}

export function gitlabSettingsFromEnv(env: Env): GitLabSettings {
  if (!env["DANGER_GITLAB_TOKEN"]) {
    throw new Error(`DANGER_GITLAB_TOKEN is not set`)
  }
  return {
    baseUrl: env["DANGER_GITLAB_API_BASE_URL"] || "https://gitlab.com",
    token: env["DANGER_GITLAB_TOKEN"],
  }
}

export class GitLabAPI {
  fetch: typeof fetch
  // additionalHeaders: any
  private readonly d = debug("GitLabAPI")

  private token: string | undefined
  private baseUrl: string | undefined

  // private mr: GitLabMRDSL | undefined

  constructor(public readonly repoMetadata: RepoMetaData, public readonly settings: GitLabSettings) {
    this.fetch = fetch
    this.token = settings.token
    this.baseUrl = settings.baseUrl
  }

  private api = (path: string, headers: any = {}, body: any = {}, method: string, suppressErrors?: boolean) => {
    headers["Content-Type"] = "application/json"
    if (this.token && !headers["Private-Token"]) {
      headers["Private-Token"] = this.token
    }

    const containsBase = path.startsWith("http")
    const url = containsBase ? `/api/v4/${path}` : `${this.baseUrl}/api/v4/${path}`

    this.d("Sending: ", url, headers)
    return limit(() =>
      this.fetch(
        url,
        {
          method,
          body,
          headers: headers,
        },
        suppressErrors
      )
    )
  }

  get = (path: string, headers: any = {}): Promise<node_fetch.Response> => this.api(path, headers, null, "GET")

  getUserInfo = async (): Promise<GitLabUser> => {
    const response = await this.get("user")
    return response.json()
  }
}
