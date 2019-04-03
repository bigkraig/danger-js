import { Platform } from "./platform"

import { debug } from "../debug"
import { GitLabAPI } from "./gitlab/GitLabAPI"

export class GitLab implements Platform {
  private readonly d = debug("GitLab")
  name: string

  constructor(public readonly api: GitLabAPI) {
    this.name = "GitLab"
  }

  // createComment: (dangerID: string, body: string) => Promise<any>;
  // createInlineComment: (git: GitDSL, comment: string, path: string, line: number) => Promise<any>;
  // deleteInlineComment: (commentId: string) => Promise<boolean>;
  // deleteMainComment: (dangerID: string) => Promise<boolean>;
  // executeRuntimeEnvironment: (start: DangerRunner["runDangerfileEnvironment"], dangerfilePath: string, environment: any) => Promise<void>;
  // getFileContents: (path: string, slug?: string, ref?: string) => Promise<string>;
  // getInlineComments: (dangerID: string) => Promise<Comment[]>;

  // getPlatformGitRepresentation = (): Promise<GitJSONDSL> => gitDSLForBitBucketServer(this.api)

  // getPlatformReviewDSLRepresentation: () => Promise<any>;
  // getPlatformReviewSimpleRepresentation: () => Promise<any>;
  // getReviewInfo: () => Promise<any>;
  // handlePostingResults: (results: DangerResults, options: ExecutorOptions) => void;
  // platformResultsPreMapper: (results: DangerResults, options: ExecutorOptions) => Promise<DangerResults>;
  supportsCommenting() {
    return true
  }

  supportsInlineComments() {
    return true
  }

  // updateInlineComment: (comment: string, commentId: string) => Promise<any>;
  // updateOrCreateComment: (dangerID: string, newComment: string) => Promise<string | undefined>;
  // updateStatus: (passed: (boolean | "pending"), message: string, url?: string, dangerID?: string) => Promise<boolean>;
}
