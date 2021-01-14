# 📦🏷bumpup
**fully automated and extensible software versioning**

[![bumpup](https://img.shields.io/badge/%F0%9F%93%A6-bumpup-informational)](https:/github.com/danielr1996/bumpup)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Open Source Love png1](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)
[![Awesome Badges](https://img.shields.io/badge/badges-awesome-green.svg)](https://github.com/Naereen/badges)

![Build](https://github.com/danielr1996/bumpup/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/danielr1996/bumpup/branch/master/graph/badge.svg)](https://codecov.io/gh/danielr1996/bumpup)
[![HitCount](http://hits.dwyl.com/danielr1996/bumpup.svg)](http://hits.dwyl.com/danielr1996/bumpup)
> 🚧 This is still a work in progress. While the core library already works well, not all use cases may already
> supported.

> 📦 If you just want to see how to use `bumpup` head straight to [@bumpup/cli](core/cli/README.md)

> ⚠ Only Node Version with ESM support are supported by `bumpup`, this means:
>
> Node &gt;= 13.2: full support
>
> Node 10 - 13.1:  potentional support through node flags but without any guaranties
>
> Node <10: definitly no support

Like
[standard-version](https://github.com/conventional-changelog/standard-version#readme),
[release-it](https://github.com/release-it/release-it#readme) or
[semantic-release](https://github.com/semantic-release/semantic-release)
but more configurable.

## Highlights
- configurable
- extensible through plugins
- automated
- monorepo compatible

## Key Concepts
`bumpup` focuses on automating the typical steps involved in software versioning, which for a simple npm project might be:
- reading the current version from `package.json`
- determining the next version according to `semver`
- writing the version to `package.json`
- generating a `CHANGELOG.md` 
- push the changes back to the repository
- publish the new package to npm

While these steps work for most projects there are cases where one step differs slightly from the default. 
That's were the plugins come into play: Where other tools promote an *opinionated* style of how each step should look `bumpup`
allows you to easily swap out plugins or even write your own if your use cases is not supported. 

> 🚧 Currently you have to manually assemble your plugins even if you use a standard workflow. For a future version it is 
> planned to support presets for common use cases like `babel` does with their [babel presets](https://babeljs.io/docs/en/presets).

### Plugins
> For details on plugins see the [plugins directory](plugins/README.md)

A plugin simply is a function that takes options and data and returns data. The `@bumpup/lib` package executes each plugin and passes
the result to the next plugin. What a plugin does with that data is completely up to the plugin author. 
The standard workflow for a npm package would use the following plugins:

1. `@bumpup/version-package-json` reads the version from `package.json`
2. `@bumpup/type-git-tags` determines the change type by looking at the git history using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
3. `@bumpup/determine-semver` determines the next version according to [semver](https://semver.org/)
4. `@bumpup/bump-package-json` updates the version in the `package.json`

If you use a different versioning system than semver like an incrementing number you simple swap out the plugin. 
> There is rarely a case where you *should not use semver* [sentimentalversioning.org](http://sentimentalversioning.org/) 
> has a few examples of funny versioning systems and why they are bad. 
> But `bumpup` is not here to tell you which versioning system to use, if you really want to use a funny versioning system
> you're free to use it.

If you're developing a java project with maven swap `@bumpup/version-package-json` and `@bumpup/bump-package-json` for plugins
that can read and write to a `pom.xml`

These are just a few examples how `bumpup` can be used. But with the plugin system it really just depends on 
the availability of plugins or your willingness to write your own plugin. 

Plugins are really simple, so don't be afraid to write your own plugin if your use cases isn't yet supported.

## Usage
For usage instructions see the [@bumpup/cli](core/cli/README.md) package.
