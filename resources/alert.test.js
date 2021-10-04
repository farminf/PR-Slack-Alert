const { verifyGitHubSignature } = require("./alert");

describe("testing alert function", () => {
  it("should be able to validate the secret", () => {
    const res = verifyGitHubSignature("53eb5b8e-9bb0-4efb-9e21-b3a7082af004");
    expect(res).toBe(true);
  });
});
