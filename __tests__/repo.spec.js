const axios = require("axios");
const path = require("path");
const helpers = require("yeoman-test");

jest.spyOn(axios, "post").mockImplementation(jest.fn());
jest.spyOn(global.console, "log");

beforeEach(() => {
  jest.resetAllMocks();
});

const getMessage = (
  org,
  name
) => `To finish creating the repo, run the following commands:

git remote add origin git@github.com:${org}/${name}.git
git push -u origin main`;

async function runGenerator(prompts, packageJSON = {}) {
  let generator;

  await helpers
    .run(path.join(__dirname, "../generators/repo"))
    .withPrompts(prompts)
    .on("ready", (gen) => {
      generator = gen;
      generator.fs.writeJSON("package.json", packageJSON);
      generator.spawnCommand = jest.fn();
    });

  return generator;
}

describe("setting prompt defaults", () => {
  describe("when homepage is not present in package.json", () => {
    it("defaults org to mskelton", async () => {
      await runGenerator({ name: "my-repo" });

      expect(axios.post).toBeCalledWith(
        "https://api.github.com/user/repos",
        expect.objectContaining({ name: "my-repo" }),
        expect.anything()
      );

      expect(console.log).toBeCalledWith(getMessage("mskelton", "my-repo"));
    });
  });

  describe("when homepage is present in package.json", () => {
    describe("and is a valid GitHub url", () => {
      it("extracts org from homepage", async () => {
        await runGenerator(
          { name: "my-repo" },
          { homepage: "https://github.com/my-org/my-repo" }
        );

        expect(axios.post).toBeCalledWith(
          "https://api.github.com/orgs/my-org/repos",
          expect.objectContaining({ name: "my-repo" }),
          expect.anything()
        );

        expect(console.log).toBeCalledWith(getMessage("my-org", "my-repo"));
      });
    });

    describe("and is not a valid GitHub url", () => {
      it("uses default personal url", async () => {
        await runGenerator({ name: "my-repo" }, { homepage: "foo" });

        expect(axios.post).toBeCalledWith(
          "https://api.github.com/user/repos",
          expect.objectContaining({ name: "my-repo" }),
          expect.anything()
        );

        expect(console.log).toBeCalledWith(getMessage("mskelton", "my-repo"));
      });
    });
  });

  it("extracts name from package.json name", async () => {
    await runGenerator({ org: "foo" }, { name: "bar" });

    expect(axios.post).toBeCalledWith(
      "https://api.github.com/orgs/foo/repos",
      expect.objectContaining({ name: "bar" }),
      expect.anything()
    );

    expect(console.log).toBeCalledWith(getMessage("foo", "bar"));
  });

  it("extracts description from package.json description", async () => {
    await runGenerator({ org: "foo" }, { description: "baz", name: "bar" });

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({ description: "baz" }),
      expect.anything()
    );
  });
});

describe("repo creation", () => {
  describe("when org is mskelton", () => {
    it("uses GitHub user url", async () => {
      await runGenerator({ org: "mskelton" });

      expect(axios.post).toBeCalledWith(
        "https://api.github.com/user/repos",
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe("when org is not mskelton", () => {
    it("uses GitHub org url", async () => {
      await runGenerator({ org: "foo" });

      expect(axios.post).toBeCalledWith(
        "https://api.github.com/orgs/foo/repos",
        expect.anything(),
        expect.anything()
      );
    });
  });

  it("passes name and description in payload", async () => {
    await runGenerator({ description: "foo", name: "bar" });

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        description: "foo",
        name: "bar",
      }),
      expect.anything()
    );
  });
});
