// import { FakeCI } from "../../../ci_source/providers/Fake"
import { GitLabAPI } from "../GitLabAPI"

const fetchJSON = (api: any, params: any): Promise<any> => {
  return Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        api,
        ...params,
      }),
  })
}

describe("API testing", () => {
  let api: GitLabAPI

  beforeEach(() => {
    api = new GitLabAPI(
      { repoSlug: "unused/metadata", pullRequestID: "1" },
      {
        token: "ABCDE",
        baseUrl: "https://gitlab.com",
      }
    )
  })

  it("getUserInfo", async () => {
    api.fetch = fetchJSON
    expect(await api.getUserInfo()).toMatchObject({
      api: "https://gitlab.com/api/v4/user",
      headers: {
        "Private-Token": "ABCDE",
        "Content-Type": "application/json",
      },
      method: "GET",
    })
  })
})
