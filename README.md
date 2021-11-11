# create-mskelton

[![Build status](https://github.com/mskelton/create-mskelton/workflows/Release/badge.svg)](https://github.com/mskelton/create-mskelton/actions)

## Usage

### npm

```sh
npm init mskelton
```

### Yarn

```sh
yarn create mskelton
```

## CLI Flags

### `--actions`

When set, the generate will include standard build and format workflows for GitHub actions.

### `--create-repo`

When set, the generator will create a GitHub repo to accompany your project. To use this flag, first ensure that you have a `GITHUB_TOKEN` exported in your shell. This token can be created on your GitHub user settings and should have the `public_repo` OAuth scope.
