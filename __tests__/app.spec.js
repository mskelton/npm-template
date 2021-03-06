const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

const projectDescription = "Some description of my project";
const repoName = "my-project";
const packageName = "@mskelton/my-project";

// File paths
const packageJSON = `${repoName}/package.json`;

const defaultPrompts = {
  packageName,
  projectDescription,
  repoName,
};

function runGenerator(prompts) {
  return helpers
    .run(path.join(__dirname, "..", "generators", "app"))
    .withPrompts({ ...defaultPrompts, ...prompts });
}

describe("Base template", () => {
  beforeAll(() => {
    return runGenerator();
  });

  it("creates files", () => {
    assert.file([
      `${repoName}/.all-contributorsrc`,
      `${repoName}/.gitignore`,
      `${repoName}/CHANGELOG.md`,
      `${repoName}/LICENSE`,
      `${repoName}/package.json`,
      `${repoName}/README.md`,
    ]);
  });

  describe("README", () => {
    const filename = `${repoName}/README.md`;

    it("uses package name for level 1 header", () => {
      assert.fileContent(filename, new RegExp(`^# ${packageName}\n`));
    });

    it("has quoted block with project description", () => {
      assert.fileContent(filename, new RegExp(`\n> ${projectDescription}\n`));
    });
  });

  describe("package.json", () => {
    it("uses package name for package name", () => {
      assert.JSONFileContent(packageJSON, { name: packageName });
    });

    it("uses project description for package description", () => {
      assert.JSONFileContent(packageJSON, { description: projectDescription });
    });

    it("contains repository, homepage, and bugs urls", () => {
      assert.JSONFileContent(packageJSON, {
        bugs: {
          url: `https://github.com/mskelton/${repoName}/issues`,
        },
        homepage: `https://github.com/mskelton/${repoName}#readme`,
        repository: {
          url: `https://github.com/mskelton/${repoName}.git`,
        },
      });
    });
  });

  describe("LICENSE", () => {
    it("contains current year", () => {
      assert.fileContent(
        `${repoName}/LICENSE`,
        `Copyright (c) ${new Date().getFullYear()}, Mark Skelton`
      );
    });
  });
});

describe("Keywords", () => {
  it("accepts comma separated values without spaces", async () => {
    await runGenerator({ keywords: "one,two,three" });

    assert.JSONFileContent(packageJSON, { keywords: ["one", "two", "three"] });
  });

  it("accepts comma separated values with spaces", async () => {
    await runGenerator({ keywords: "one , two  ,  three  " });

    assert.JSONFileContent(packageJSON, { keywords: ["one", "two", "three"] });
  });
});

describe("Linting", () => {
  beforeAll(() => {
    return runGenerator({ lint: true });
  });

  it("adds ESLint config to package.json", () => {
    assert.JSONFileContent(packageJSON, {
      eslintConfig: {
        extends: "@mskelton",
      },
    });
  });
});

describe("npm library", () => {
  beforeAll(() => {
    return runGenerator({ npm: true });
  });

  it("creates files", () => {
    assert.file(`${repoName}/.github/workflows/build.yml`);
  });

  it("adds installation steps to the readme", () => {
    assert.fileContent(`${repoName}/README.md`, `npm install ${packageName}`);
  });
});

describe("VS Code template", () => {
  beforeAll(() => {
    return runGenerator({ vsce: true });
  });

  it("creates files", () => {
    assert.file([
      `${repoName}/.github/workflows/build.yml`,
      `${repoName}/.vscode/launch.json`,
      `${repoName}/.vscodeignore`,
    ]);
  });

  it("workflow contains repo name", () => {
    assert.fileContent(
      `${repoName}/.github/workflows/build.yml`,
      `npx vsce package -o dist/${repoName}-\${GITHUB_REF/refs\\/tags\\//}.vsix`
    );
  });
});
