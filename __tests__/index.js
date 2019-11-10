const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

const projectDescription = 'Some description of my project'
const projectId = 'my-project'
const projectName = 'My Project'

const defaultPrompts = {
  projectDescription,
  projectId,
  projectName,
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

  describe('README', () => {
    const filename = `${projectId}/README.md`

    it('uses project name for level 1 header', () => {
      assert.fileContent(filename, new RegExp(`^# ${projectName}\n`))
    })

    it('has quoted block with project description', () => {
      assert.fileContent(filename, new RegExp(`\n> ${projectDescription}\n`))
    })
  })

  describe('package.json', () => {
    const filename = `${projectId}/package.json`

    it('uses project id for package name', () => {
      assert.JSONFileContent(filename, { name: projectId })
    })

    it('uses project description for package description', () => {
      assert.JSONFileContent(filename, { description: projectDescription })
    })

    it('contains repository, homepage, and bugs urls', () => {
      assert.JSONFileContent(filename, {
        bugs: {
          url: `https://github.com/mskelton/${projectId}/issues`,
        },
        homepage: `https://github.com/mskelton/${projectId}#readme`,
        repository: {
          url: `https://github.com/mskelton/${projectId}.git`,
        },
      })
    })
  })

  describe('LICENSE', () => {
    it('contains current year', () => {
      assert.fileContent(
        `${projectId}/LICENSE`,
        `Copyright (c) ${new Date().getFullYear()} Mark Skelton`
      )
    })
  })
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

  it('publish workflow contains project id', () => {
    assert.fileContent(
      `${projectId}/.github/workflows/publish.yml`,
      `yarn vsce package -o dist/${projectId}-\${GITHUB_REF/refs\\/tags\\//}.vsix`
    )
  })
})
