# automated-version
> ⚠ This is still a work in progress. While the core library already works well, not all use cases may already
> supported

The best of
[standard-version](https://github.com/conventional-changelog/standard-version#readme),
[release-it](https://github.com/release-it/release-it#readme) and
[semantic-release](https://github.com/semantic-release/semantic-release).

## Highlights
- configurable
- extensible
- automated
- monorepo compatible
- does one thing and does it well

## Key Concepts
automated-version focuses on automating the typical steps involved in software versioning, which usually are
- reading the current version from somewhere, e.g. `package.json` or `composer.json`
- determining what the next version should be according to the changes since the last version, e.g. using `semver`
- updating the version, e.g. in `package.json`, `composer.json` but also in files that are part of your source code, to
display the version users

However, it makes no assumptions on the package manager, version control system, versioning semantics or anything else
you're using. While most solutions that already exists focus on node, git and semver,  automated release can work with 
anything. This is accomplished by stripping out all the heavy work of reading version, writing versions, etc and delegating
it to plugins. 

### Lifecycle
The automated-version lifecycle consists of the following steps:
1. Get the current version
2. Get the type of changes since the last version
3. Determine what the new version should be using the last version and type of change
4. Update the version
5. Record the updated version, so that step 3 can get the differences between the last version

## Usage
```
npx autov
```
For detailed usage see the cli package

Technically you can combine any plugins you want, but because the values are passed through each plugin you need to
make sure a plugin can read the value that the previous plugins returned. 

The `plugin-determine-semver` plugin expects a valid semver string (e.g. `1.2.3`) and a valid change type (`major`, `minor` or `patch`).
If you use that with a plugin that uses timestamps as versions thats not going to work.



## Components / What's inside?
`automated-version` is structured as a monorepo and consists of the following subpackages. For detailed information on
each packages see the README.md in each package's directory.
The core packages are `cli` and `lib`, all other packages are plugins for the individual lifecycle steps.

### lib
This is the heart of automated-version. It only executes the lifecycle steps and nothing else.

### cli
This is the user facing part of `automated-version`, it's used from the command line and passes the plugins that should
be used and the configuration to the `lib` package.

### plugin-readversion-file
reads the version from a plaintext file

### plugin-readversion-package-json
reads the version from `package.json`

### plugin-writeversion-file
writes the version to a plaintext file

### plugin-writeversion-package-json
writes the version to `package.json`

### plugin-determineversion-semver
determines the next version according to `semver`

### plugin-readchangetype-git
reads the change type by looking at the git commit history 

## fp
functional utils like `compose` or `lift`

This could probably a completely independant package.

## Roadmap
- Lifecycle Hooks to support publishing to npm and pushing to git
- Automated releasing: use idempotent-release to version itself
- use monorepo tools like lerna
- publish to npm
- bootstrap new plugins
- ship fp as own library
- use more typescript types
- bootstrap config
- interactive mode, ask before writing
- default config
- different logging modes
- linting
- Refactoring:
    - Cleanup package.jsons
    - Ship types with library
    - build and test with es6
    - add integration tests
    - revise use of tsconfig.json and tsconfig.test.json, jest.config.json
    - revise naming of things, especially plugins
