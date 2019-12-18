const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

const projectDescription = 'Some description of my project'
const projectId = 'my-project'
const packageName = 'My Project'

// File paths
const packageJSON = `${projectId}/package.json`

const defaultPrompts = {
  projectDescription,
  projectId,
  packageName,
}

function runGenerator(prompts) {
  return helpers
    .run(path.join(__dirname, '..', 'generators', 'app'))
    .withPrompts({ ...defaultPrompts, ...prompts })
}

describe('Base template', () => {
  beforeAll(() => {
    return runGenerator()
  })

  it('creates files', () => {
    assert.file([
      `${projectId}/.all-contributorsrc`,
      `${projectId}/.gitignore`,
      `${projectId}/CHANGELOG.md`,
      `${projectId}/LICENSE`,
      `${projectId}/package.json`,
      `${projectId}/README.md`,
    ])
  })

  describe('README', () => {
    const filename = `${projectId}/README.md`

    it('uses project name for level 1 header', () => {
      assert.fileContent(filename, new RegExp(`^# ${packageName}\n`))
    })

    it('has quoted block with project description', () => {
      assert.fileContent(filename, new RegExp(`\n> ${projectDescription}\n`))
    })
  })

  describe('package.json', () => {
    it('uses project id for package name', () => {
      assert.JSONFileContent(packageJSON, { name: projectId })
    })

    it('uses project description for package description', () => {
      assert.JSONFileContent(packageJSON, { description: projectDescription })
    })

    it('contains repository, homepage, and bugs urls', () => {
      assert.JSONFileContent(packageJSON, {
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

describe('Keywords', () => {
  it('accepts comma separated values without spaces', async () => {
    await runGenerator({ keywords: 'one,two,three' })

    assert.JSONFileContent(packageJSON, { keywords: ['one', 'two', 'three'] })
  })

  it('accepts comma separated values with spaces', async () => {
    await runGenerator({ keywords: 'one , two  ,  three  ' })

    assert.JSONFileContent(packageJSON, { keywords: ['one', 'two', 'three'] })
  })
})

describe('Linting', () => {
  beforeAll(() => {
    return runGenerator({ lint: true })
  })

  it('adds ESLint config to package.json', () => {
    assert.JSONFileContent(packageJSON, {
      eslintConfig: {
        extends: '@mskelton',
      },
    })
  })

  it('adds Prettier config to package.json', () => {
    assert.JSONFileContent(packageJSON, {
      prettier: '@mskelton/prettier-config',
    })
  })
})

describe('npm library', () => {
  beforeAll(() => {
    return runGenerator({ npm: true })
  })

  it('creates files', () => {
    assert.file(`${projectId}/.github/workflows/build.yml`)
  })

  it('adds installation steps to the readme', () => {
    assert.fileContent(`${projectId}/README.md`, `yarn add ${projectId}`)
    assert.fileContent(`${projectId}/README.md`, `npm install ${projectId}`)
  })
})

describe('VS Code template', () => {
  beforeAll(() => {
    return runGenerator({ vsce: true })
  })

  it('creates files', () => {
    assert.file([
      `${projectId}/.github/workflows/build.yml`,
      `${projectId}/.vscode/launch.json`,
      `${projectId}/.vscodeignore`,
    ])
  })

  it('workflow contains project id', () => {
    assert.fileContent(
      `${projectId}/.github/workflows/build.yml`,
      `yarn vsce package -o dist/${projectId}-\${GITHUB_REF/refs\\/tags\\//}.vsix`
    )
  })
})
