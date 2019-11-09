const path = require('path')
const Generator = require('yeoman-generator')
const yosay = require('yosay')

module.exports = class extends Generator {
  constructor(...args) {
    super(...args)

    this.option('project-id', {
      description: 'Project Id',
      type: String,
    })

    this.option('project-name', {
      description: 'Human-readable name for the project',
      type: String,
    })

    this.option('project-desc', {
      description: 'Short description of the project',
      type: String,
    })

    this.option('vsce', {
      description: 'Add VS Code extension files',
      type: Boolean,
    })
  }

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
        default: false,
        message: 'Is this project a VS Code extension?',
        name: 'vscodeExtension',
        type: 'confirm',
      },
    ])

    this.destinationDir = path.join(process.cwd(), this.answers.projectId)
  }

  writing() {
    const context = {
      projectDescription: this.answers.projectDescription,
      projectId: this.answers.projectId,
      projectName: this.answers.projectName,
      year: new Date().getFullYear(),
    }

    const copyOptions = { globOptions: { dot: true } }

    this.fs.copyTpl(
      this.templatePath('default/**'),
      this.destinationPath(this.answers.projectId),
      context,
      undefined,
      copyOptions
    )

    if (this.answers.vscodeExtension) {
      this.fs.copyTpl(
        this.templatePath('vscode/**'),
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
}
