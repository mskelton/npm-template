const axios = require("axios");
const Generator = require("yeoman-generator");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user
    this.log(yosay("Welcome to the mskelton repo generator!"));

    // Read the package.json file to get the default values
    this._readPackageJSON();

    // Prompt the user for the answers
    this.answers = await this.prompt([
      {
        choices: ["mskelton", "one-dark"],
        default: this._getDefaultOrg("mskelton"),
        message: "Who is the repo org?",
        name: "org",
        type: "list",
      },
      {
        default: this.packageJSON.name,
        message: "What is the repo name?",
        name: "name",
        type: "input",
      },
      {
        default: this.packageJSON.description,
        message: "What is the repo description?",
        name: "description",
        type: "input",
      },
    ]);
  }

  createRepo() {
    const url =
      this.answers.org === "mskelton"
        ? `/user/repos`
        : `/orgs/${this.answers.org}/repos`;

    const payload = {
      allow_merge_commit: false,
      allow_rebase_merge: false,
      delete_branch_on_merge: true,
      description: this.answers.description,
      has_projects: false,
      has_wiki: false,
      name: this.answers.name,
      private: false,
    };

    const headers = {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    };

    return axios.post("https://api.github.com" + url, payload, { headers });
  }

  addOrigin() {
    const { name, org } = this.answers;

    console.log(`To finish creating the repo, run the following commands:

git remote add origin git@github.com:${org}/${name}.git
git push -u origin main`);
  }

  _readPackageJSON() {
    this.packageJSON = this.fs.readJSON("package.json") || {};
  }

  _getDefaultOrg(fallback) {
    if (!this.packageJSON.homepage) {
      return fallback;
    }

    const match = this.packageJSON.homepage.match(
      /https:\/\/github\.com\/(.+)\/.+/
    );

    return match ? match[1] : fallback;
  }
};
