const Generator = require('yeoman-generator')
const yosay = require('yosay')

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user
    this.log(yosay('Welcome to the mskelton generator!'))

    const prompts = [
      {
        default: false,
        message: 'Is this project a VS Code extension?',
        name: 'vscodeExtension',
        type: 'confirm',
      },
    ]

    return this.prompt(prompts)
  }

  writing() {
    console.log(this.props)
    // this.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // )

    this.composeWith(require.resolve('generator-license'), {
      license: 'MIT',
      name: 'Mark Skelton',
    })
  }

  install() {
    this.installDependencies()
  }
}
