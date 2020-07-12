# @bumpup/cli
[![npm version](https://badge.fury.io/js/%40bumpup%2Fcli.svg)](https://badge.fury.io/js/%40bumpup%2Fcli)

This is the cli for bumpup

## Usage
### Installation
To use bumpup install it in your project
```shell script
npm install @bumpup/cli --save-dev
```

Then install the plugins that you'd like to use for the lifecycle steps.

You can use the official plugins under the `@bumpup` scope, or any other plugin complying to the plugin interface.

```shell script
npm install @bumpup/version-package-json @bumpup/type-git @bumpup/determine-semver @bumpup/package-json --save-dev
```

### Configuration
> 🗑 The old `bumpup.json` is no longer supported.

> Currently only `bumpup.config.mjs` is supported as configuration. 
> In a future version more configuration sources are planned to be supported, being merged in the following order:
> - sensible default (@bumpup/version-package-json, @bumpup/type-git, @bumpup/determine-semver, @bumpup/package-json)
> - `~/.bumpup.config.mjs`
> - `bumpup.config.mjs` (searching up to the filesystem root until a `bumpup.config.mjs` is found, like package.json is found )

#### bumpup.config.mjs
Put a `bumpup.config.mjs` in your project specifing the plugins to use in your project folder next to your `package.json`.

```js
import version from '@bumpup/version-package-json';
import {type, record} from '@bumpup/type-git';
import bump from '@bumpup/bump-package-json';
import determine from '@bumpup/determine-semver';

export default {
    version: "2.0.0",
    plugins: [
        version,
        type,
        determine,
        bump,
        record,
    ]
}
```

Run `bumpup` from the same directory where the `bumpup.json`. You should get an output similiar to
```shell script
📖 current version is 2.0.0
🅱 change type is none
🔎 no new version
👊 not bumping version in package.json
📌 not recording version in git
```
