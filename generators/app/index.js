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
        message: 'What keywords describe your project (comma separated)?',
        name: 'keywords',
        type: 'input',
      },
      {
        default: true,
        message: 'Do you need ESLint and Prettier?',
        name: 'lint',
        type: 'confirm',
      },
      {
        default: false,
        message: 'Is this project an npm package?',
        name: 'npm',
        type: 'confirm',
      },
      {
        default: false,
        message: 'Is this project a VS Code extension?',
        name: 'vsce',
        type: 'confirm',
      },
    ])

    // Helper variable for the destination path of package.json
    this.packageJSON = this.destinationPath(
      path.join(this.answers.projectId, 'package.json')
    )

    // Use the projectId as the project folder name
    this.destinationDir = path.join(process.cwd(), this.answers.projectId)

    // Install packages in the destination directory
    this.installOptions = { cwd: this.destinationDir }
  }

  writing() {
    this.context = {
      ...this.answers,
      year: new Date().getFullYear(),
    }

    // Base files are always copied
    this._copyTpl('base')

    // Write keywords to package.json if provided by the user
    this._writeKeywords()

    // Copy the npm library files
    if (this.answers.npm) {
      this._copyTpl('npm')
    }

    // Copy the VS Code extension files
    if (this.answers.vsce) {
      this._copyTpl('vsce')
    }

    // Add lint config and install lint packages
    if (this.answers.lint) {
      this._installLinter()
    }
  }

  _copyTpl(src) {
    this.fs.copyTpl(
      this.templatePath(src),
      this.destinationPath(this.answers.projectId),
      this.context,
      undefined,
      {
        globOptions: {
          dot: true,
        },
      }
    )
  }

  _installLinter() {
    this.fs.extendJSON(this.packageJSON, {
      eslintConfig: {
        extends: '@mskelton',
      },
      prettier: '@mskelton/prettier-config',
    })

    this.yarnInstall(
      [
        '@mskelton/eslint-config',
        '@mskelton/prettier-config',
        'eslint-plugin-import',
        'eslint-plugin-node',
        'eslint-plugin-prettier',
        'eslint-plugin-promise',
        'eslint-plugin-sort-destructure-keys',
        'eslint-plugin-standard',
        'eslint',
        'prettier',
      ],
      { dev: true },
      this.installOptions
    )
  }

  _writeKeywords() {
    if (!this.answers.keywords) {
      return
    }

    const keywords = this.answers.keywords
      .split(',')
      .map(keyword => keyword.trim())

    this.fs.extendJSON(this.packageJSON, { keywords })
  }
}
