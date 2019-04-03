import { GitJSONDSL } from "../../dsl/GitDSL"
import { GitLabAPI } from "./GitLabAPI"

export default async function gitDSLForBitBucketServer(api: GitLabAPI): Promise<GitJSONDSL> {
  // We'll need all this info to be able to generate a working GitDSL object
  const changes = await api.getPullRequestChanges()
  const gitCommits = await api.getPullRequestCommits()
  const commits = gitCommits.map(commit =>
    bitBucketServerCommitToGitCommit(commit, api.repoMetadata, api.repoCredentials.host)
  )
  return bitBucketServerChangesToGitJSONDSL(changes, commits)
}
