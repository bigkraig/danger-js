import OctoKit from "@octokit/rest"

import { DangerDSLJSONType, DangerDSLType } from "../dsl/DangerDSL"
import { gitHubGitDSL as githubJSONToGitDSL } from "../platforms/github/GitHubGit"
import { githubJSONToGitHubDSL } from "../platforms/GitHub"
import { sentence, href } from "./DangerUtils"
import { LocalGit } from "../platforms/LocalGit"
import { GitDSL } from "../dsl/GitDSL"
import { bitBucketServerGitDSL } from "../platforms/bitbucket_server/BitBucketServerGit"
import { GitLabAPI, gitlabSettingsFromEnv } from "../platforms/gitlab/GitLabAPI"
import {
  BitBucketServerAPI,
  bitbucketServerRepoCredentialsFromEnv,
} from "../platforms/bitbucket_server/BitBucketServerAPI"
import { CISource } from "../ci_source/ci_source"

import { debug } from "../debug"
const d = debug("jsonToDSL")

/**
 * Re-hydrates the JSON DSL that is passed from the host process into the full DAnger DSL
 */
export const jsonToDSL = async (dsl: DangerDSLJSONType, source: CISource): Promise<DangerDSLType> => {
  // In a GitHub Action you could be running on other event types
  d(`Creating ${source && source.useEventDSL ? "event" : "pr"} DSL from JSON`)

  const api = apiForDSL(dsl)
  const platformExists = [dsl.github, dsl.bitbucket_server].some(p => !!p)
  const github = dsl.github && githubJSONToGitHubDSL(dsl.github, api as OctoKit)
  const gitlab = dsl.gitlab
  const bitbucket_server = dsl.bitbucket_server

  let git: GitDSL
  if (!platformExists) {
    const localPlatform = new LocalGit(dsl.settings.cliArgs)
    git = await localPlatform.getPlatformGitRepresentation()
  } else if (process.env["DANGER_BITBUCKETSERVER_HOST"]) {
    git = bitBucketServerGitDSL(bitbucket_server!, dsl.git, api as BitBucketServerAPI)
  } else {
    git = source && source.useEventDSL ? ({} as any) : githubJSONToGitDSL(github!, dsl.git)
  }

  return {
    git,
    // Strictly speaking, this is a lie. Only one of these will _ever_ exist, but
    // otherwise everyone would need to have a check for GitHub/BBS in every Dangerfile
    // which just doesn't feel right.
    github: github!,
    gitlab: gitlab!,
    bitbucket_server: bitbucket_server!,
    utils: {
      sentence,
      href,
    },
  }
}

const apiForDSL = (dsl: DangerDSLJSONType): OctoKit | BitBucketServerAPI | GitLabAPI => {
  if (process.env["DANGER_BITBUCKETSERVER_HOST"]) {
    return new BitBucketServerAPI(dsl.bitbucket_server!.metadata, bitbucketServerRepoCredentialsFromEnv(process.env))
  }

  if (process.env["DANGER_GITLAB_TOKEN"]) {
    return new GitLabAPI(dsl.gitlab!.metadata, gitlabSettingsFromEnv(process.env))
  }

  const options: OctoKit.Options & { debug: boolean } = {
    debug: !!process.env.LOG_FETCH_REQUESTS,
    baseUrl: dsl.settings.github.baseURL,
  }

  // Peril will need changes for this
  if (
    dsl.settings.github &&
    dsl.settings.github.additionalHeaders &&
    Object.keys(dsl.settings.github.additionalHeaders).length
  ) {
    if (dsl.settings.github.additionalHeaders.Accept) {
      options.previews = dsl.settings.github.additionalHeaders.Accept.split(",")
    }
  }

  if (dsl.settings.github && dsl.settings.github.accessToken) {
    options.auth = `token ${dsl.settings.github.accessToken}`
  }

  const api = new OctoKit(options)
  return api
}
