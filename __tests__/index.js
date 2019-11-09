const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

const projectId = 'my-project'

const defaultPrompts = {
  projectDescription: 'Some description of my project',
  projectId,
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
      `${projectId}/.all-contributorsrc`,
      `${projectId}/.gitignore`,
      `${projectId}/LICENSE`,
      `${projectId}/package.json`,
      `${projectId}/README.md`,
    ])
  })

  it('', () => {})
})

describe('VS Code template', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '..', 'generators', 'app'))
      .withPrompts({ ...defaultPrompts, vsce: true })
  })

  it('creates', () => {
    assert.file([
      `${projectId}/.github/workflows/publish.yml`,
      `${projectId}/.vscode/launch.json`,
    ])
  })
})
