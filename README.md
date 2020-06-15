# idempotent-release
The best of
[standard-version](https://github.com/conventional-changelog/standard-version#readme),
[release-it](https://github.com/release-it/release-it#readme) and
[semantic-release](https://github.com/semantic-release/semantic-release).

Key Concepts:
- idempotent: running the command multiple times yields the same result
- configurable and language-agnostic: works with any language and workflow
- does only on thing, no integrated commiting or publishing

What its not (core):
- no changelog generation, use conventional-changelog instead
- no git push
- no npm publish

## Components
`idempotent-release` is structured as a monorepo and consists of the following subpackages:
- idempotent-release-cli

## How it works
- VersionReader: reads the current version, e.g. from `package.json`
- TypeReader: reads the change type (e.g. patch,minor,major) since the current version
- Recorder/TypeReader(again): records the new version to enable the TypeReader to read the change type
- Determiner: Determines the new Version from current version, e.g. according to semver
- Bumper: Bumps the version, e.g. in `package.json`

## Roadmap
- Lifecycle Hooks to support publishing to npm and pushing to git
- Automated releasing: use idempotent-release to version itself
- use monorepo tools like lerna
- publish to npm
- bootstrap new plugins
- ship fp as own library
- use more typescript types
- Refactoring:
    - Cleanup package.jsons
    - Ship types with library
    - build and test with es6
    - add integration tests
    - revise use of tsconfig.json and tsconfig.test.json, jest.config.json
    - revise naming of things, especially plugins