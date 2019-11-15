const uuid = require('uuid/v4')
const Generator = require('yeoman-generator')
const yosay = require('yosay')

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user
    this.log(yosay('Welcome to the mskelton GitHub generator!'))

    // Read the package.json file to get the default values
    this._readPackageJSON()

    // Prompt the user for the answers
    this.answers = await this.prompt([
      {
        choices: ['mskelton', 'one-dark'],
        default: this._getDefaultOwner('mskelton'),
        message: 'Who is the repo owner?',
        name: 'owner',
        type: 'list',
      },
      {
        default: this.packageJSON.name,
        message: 'What is the repo name?',
        name: 'name',
        type: 'input',
      },
      {
        default: this.packageJSON.description,
        message: 'What is the repo description?',
        name: 'name',
        type: 'input',
      },
      {
        default: this._getDefaultKeywords(),
        message: 'Please enter some keywords for the repo?',
        name: 'name',
        type: 'input',
      },
    ])
  }

  createRepo() {
    const mutation = `
      mutation {
        createRepository(input: {
          clientMutationId: "${uuid()}",
          name: "${this.answers.name}",
          ownerId: "${this.answers.owner}",
          description: "${this.answers.description || ''}",
          hasProjectsEnabled: false,
          visibility: PRIVATE
        }) {
          clientMutationId
          name
          ownerId
          description
          hasProjectsEnabled
          visibility
        }
      }
    `

    console.log(mutation)
  }

  _readPackageJSON() {
    this.packageJSON = this.fs.readJSON('package.json') || {}
  }

  _getDefaultOwner(fallback) {
    if (!this.packageJSON.homepage) {
      return fallback
    }

    const match = this.packageJSON.homepage.match(
      /https:\/\/github\.com\/(.+)\/.+/
    )

    return match ? match[1] : fallback
  }

  _getDefaultKeywords() {
    return this.packageJSON.keywords
      ? this.packageJSON.keywords.join(',')
      : null
  }
}
