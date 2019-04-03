import { GitCommit } from "./Commit"
import { RepoMetaData } from "./BitBucketServerDSL"

// This is `danger.gitlab` inside the JSON

export interface GitLabJSONDSL {
  /** The pull request and repository metadata */
  metadata: RepoMetaData
  /** The issue metadata for a code review session */
  issue: GitLabIssue
  /** The MR metadata for a code review session */
  pr: GitLabMRDSL
  /** The MR metadata specifically formatted for using with the GitHub API client */
  thisPR: GitLabAPIMR
  /** The github commit metadata for a code review session */
  commits: GitLabCommit[]
  /** The reviews left on this pull request */
  // reviews: GitLabReview[]
  /** The people/teams requested to review this PR */
  // requested_reviewers: GitHubReviewers
}

// This is `danger.gitlab`

/** The GitLab metadata for your MR */
export interface GitLabDSL extends GitLabJSONDSL {
  /**
   * An authenticated API so you can extend danger's behavior by using the [GitHub v3 API](https://developer.github.com/v3/).
   *
   * A set up instance of the "github" npm module. You can get the full [API here](https://octokit.github.io/node-github/).
   */
  // api: GitLab
  /** A scope for useful functions related to GitHub */
  // utils: GitLabUtilsDSL
}

/**
 * This is `danger.gitlab.issue` It refers to the issue that makes up the Merge Request.
 * GitLab treats all merge requests as a special type of issue. This DSL contains only parts of the issue that are
 * not found in the MR DSL, however it does contain the full JSON structure.
 *
 * A GitLab Issue
 */
export interface GitLabIssue {
  /**
   * The labels associated with this issue
   */
  labels: GitLabIssueLabel[]
}

// Subtypes specific to issues

export interface GitLabIssueLabel {
  /** The identifying number of this label */
  id: number

  /** The URL that links to this label */
  url: string

  /** The name of the label */
  name: string

  /** The color associated with this label */
  color: string
}

export interface GitLabIssueComment {
  /**
   *  UUID for the comment
   */
  id: string

  /**
   * The User who made the comment
   */
  user: GitLabUser

  /**
   * Textual representation of comment
   */
  body: string
}

// This is `danger.github.pr`

/**
 * An exact copy of the MR's reference JSON. This interface has type'd the majority
 * of it for tooling's sake, but any extra metadata which GitLab send will still be
 * inside the JS object.
 */

export interface GitLabMRDSL {
  // /**
  //  * The UUID for the PR
  //  */
  // number: number
  //
  // /**
  //  * The state for the PR
  //  */
  // state: "closed" | "open" | "locked" | "merged"
  //
  // /**
  //  * Has the PR been locked to contributors only?
  //  */
  // locked: boolean
  //
  // /**
  //  * The title of the PR
  //  */
  // title: string
  //
  // /**
  //  * The markdown body message of the PR
  //  */
  // body: string
  //
  // /**
  //  * ISO6801 Date string for when PR was created
  //  */
  // created_at: string
  //
  // /**
  //  * ISO6801 Date string for when PR was updated
  //  */
  // updated_at: string
  //
  // /**
  //  * optional ISO6801 Date string for when PR was closed
  //  */
  // closed_at: string | null
  //
  // /**
  //  * Optional ISO6801 Date string for when PR was merged.
  //  * Danger probably shouldn't be running in this state.
  //  */
  // merged_at: string | null
  //
  // /**
  //  * Merge reference for the _other_ repo.
  //  */
  // head: GitHubMergeRef
  //
  // /**
  //  * Merge reference for _this_ repo.
  //  */
  // base: GitHubMergeRef
  //
  // /**
  //  * The User who submitted the PR
  //  */
  // user: GitHubUser
  //
  // /**
  //  * The User who is assigned the PR
  //  */
  // assignee: GitHubUser
  //
  // /**
  //  * The Users who are assigned to the PR
  //  */
  // assignees: GitHubUser[]
  //
  // /**
  //  * Has the PR been merged yet?
  //  */
  // merged: boolean
  //
  // /**
  //  * The number of comments on the PR
  //  */
  // comments: number
  //
  // /**
  //  * The number of review-specific comments on the PR
  //  */
  // review_comments: number
  //
  // /**
  //  * The number of commits in the PR
  //  */
  // commits: number
  //
  // /**
  //  * The number of additional lines in the PR
  //  */
  // additions: number
  //
  // /**
  //  * The number of deleted lines in the PR
  //  */
  // deletions: number
  //
  // /**
  //  * The number of changed files in the PR
  //  */
  // changed_files: number
  //
  // /**
  //  * The link back to this PR as user-facing
  //  */
  // html_url: string
  //
  // /** How does the PR author relate to this repo/org? */
  // author_association:
  //   | "COLLABORATOR"
  //   | "CONTRIBUTOR"
  //   | "FIRST_TIMER"
  //   | "FIRST_TIME_CONTRIBUTOR"
  //   | "MEMBER"
  //   | "NONE"
  //   | "OWNER"
}

// These are the individual subtypes of objects inside the larger DSL objects above.

/** A GitLab specific implementation of a git commit */
export interface GitLabCommit {
  /** The raw commit metadata */
  commit: GitCommit
  /** The SHA for the commit */
  sha: string
  /** the url for the commit on GitHub */
  url: string
  /** The GitLab user who wrote the code */
  author: GitLabUser
  /** The GitLab user who shipped the code */
  committer: GitLabUser
  /** An array of parent commit shas */
  parents: any[]
}

/**
 * A GitLab user account.
 */
export interface GitLabUser {
  /**
   * Generic UUID
   */
  id: number
  /**
   * The handle for the user/org
   */
  login: string
  /**
   * Whether the user is an org, or a user
   */
  // type: "User" | "Organization" | "Bot"
  /**
   * The url for a users's image
   */
  avatar_url: string
  /**
   * The href for a users's page
   */
  href: string
}

/**
 * A GitLab Repo
 */
export interface GitLabRepo {
  /**
   * Generic UUID
   */
  id: number

  /**
   * The name of the repo, e.g. "Danger-JS"
   */
  name: string

  /**
   * The full name of the owner + repo, e.g. "Danger/Danger-JS"
   */
  full_name: string

  /**
   * The owner of the repo
   */
  owner: GitLabUser

  /**
   * Is the repo publicly accessible?
   */
  private: boolean

  /**
   * The textual description of the repo
   */
  description: string

  /**
   * Is the repo a fork?
   */
  fork: boolean

  /**
   * Is someone assigned to this PR?
   */
  assignee: GitLabUser

  /**
   * Are there people assigned to this PR?
   */
  assignees: GitLabUser[]
  /**
   * The root web URL for the repo, e.g. https://github.com/artsy/emission
   */
  html_url: string
}

// export interface GitHubMergeRef {
//   /**
//    * The human display name for the merge reference, e.g. "artsy:master"
//    */
//   label: string
//
//   /**
//    * The reference point for the merge, e.g. "master"
//    */
//   ref: string
//
//   /**
//    * The reference point for the merge, e.g. "704dc55988c6996f69b6873c2424be7d1de67bbe"
//    */
//   sha: string
//
//   /**
//    * The user that owns the merge reference e.g. "artsy"
//    */
//   user: GitLabUser
//   /**
//    * The repo from whch the reference comes from
//    */
//   repo: GitHubRepo
// }

// /**
//  * GitHubReview
//  * While a review is pending, it will only have a user.  Once a review is complete, the rest of
//  * the review attributes will be present
//  * @export
//  * @interface GitHubReview
//  */
// export interface GitHubReview {
//   /**
//    * The user requested to review, or the user who has completed the review
//    */
//   user: GitLabUser
//   /**
//    * If there is a review, this provides the ID for it
//    */
//   id?: number
//
//   /**
//    * If there is a review, the body of the review
//    */
//   body?: string
//
//   /**
//    * If there is a review, the commit ID this review was made on
//    */
//   commit_id?: string
//
//   /**
//    * The state of the review
//    * APPROVED, REQUEST_CHANGES, COMMENT or PENDING
//    */
//   state?: "APPROVED" | "REQUEST_CHANGES" | "COMMENT" | "PENDING"
// }

/** Provides the current MR in an easily used way for params in `github.api` calls  */
export interface GitLabAPIMR {
  /** The repo owner */
  owner: string
  /** The repo name */
  repo: string
  /** The PR number */
  number: number
}
//
// export interface GitHubReviewers {
//   /** Users that have been requested */
//   users: GitLabUser[]
//   /** Teams that have been requested */
//   teams: any[]
// }
