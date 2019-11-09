const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

const defaultPrompts = {
  projectDescription: 'Some description of my project',
  projectId: 'my-project',
  projectName: 'My Project',
}

describe('Base template', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '..', 'generators', 'app'))
      .withPrompts(defaultPrompts)
  })

  it('creates files', () => {
    assert.file([
      '.all-contributorsrc',
      '.gitignore',
      'LICENSE',
      'package.json',
      'README.md',
      'yarn.lock',
    ])
  })

  it('', () => {})
})

describe('VS Code template', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '..', 'generators', 'app'))
      .withPrompts(defaultPrompts)
  })

  it('creates', () => {
    assert.file(['.github/workflows/publish.yml', '.vscode/launch.json'])
  })
})
