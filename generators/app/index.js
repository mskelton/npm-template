const path = require('path')
const Generator = require('yeoman-generator')
const yosay = require('yosay')

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user
    this.log(yosay('Welcome to the mskelton generator!'))

    this.answers = await this.prompt([
      {
        message: 'What is the project id?',
        name: 'projectId',
        type: 'input',
      },
      {
        message: 'What is the project human-readable name?',
        name: 'projectName',
        type: 'input',
      },
      {
        message: 'What is a short description of the project?',
        name: 'projectDescription',
        type: 'input',
      },
      {
        default: '',
        message: 'What keywords describe your project (comma separated)?',
        name: 'keywords',
        type: 'input',
      },
      {
        default: false,
        message: 'Do you need ESLint and Prettier?',
        name: 'lint',
        type: 'confirm',
      },
      {
        default: false,
        message: 'Is this project a VS Code extension?',
        name: 'vsce',
        type: 'confirm',
      },
    ])

    this.destinationDir = path.join(process.cwd(), this.answers.projectId)
  }

  writing() {
    const context = {
      ...this.answers,
      keywords: this._parseKeywords(),
      year: new Date().getFullYear(),
    }

    const copyOptions = { globOptions: { dot: true } }

    this.fs.copyTpl(
      this.templatePath('base'),
      this.destinationPath(this.answers.projectId),
      context,
      undefined,
      copyOptions
    )

    if (this.answers.vsce) {
      this.fs.copyTpl(
        this.templatePath('vscode'),
        this.destinationPath(this.answers.projectId),
        context,
        undefined,
        copyOptions
      )
    }
  }

  install() {
    this.yarnInstall(undefined, undefined, { cwd: this.destinationDir })
  }

  _parseKeywords() {
    return this.answers.keywords
      .split(',')
      .map(keyword => keyword.trim())
      .join('", "')
  }
}
