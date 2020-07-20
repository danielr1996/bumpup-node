# @bumpup/cli
[![npm version](https://badge.fury.io/js/%40bumpup%2Fcli.svg)](https://badge.fury.io/js/%40bumpup%2Fcli)

This is the cli for bumpup

## Quickstart 
```shell script
npm install @bumpup/cli --save-dev
npm install @bumpup/version-package-json @bumpup/type-git @bumpup/determine-semver @bumpup/version-package-json --save-dev
npx bumpup init
npx bumpup
```

## Usage
To see all options and commands run `bumpup --help` or `bumpup <subcommands> help`

### Options and commands
#### bumpup bump
> For convience the `bump` subcommand can be executed with just `bumpup` too.

```shell script
$ npx bumpup bump --help
Usage: bumpup bump [options]

bumps up the version

Options:
  -d, --dry                 executes all plugins in dry mode, preventing potentially destructive operations (default: false)
  -l, --log <log-level>     specifies the log level (error, warn, info, verbose, debug, silly) (default: "info")
  -h, --help                display help for command
```

#### bumpup init

```shell script
$ npx bumpup init --help
Usage: bumpup init [options]

initializes a default config file

Options:
  -f, --file <config-file>  which config file to write (default: "bumpup.config.mjs")
  -h, --help                display help for command
```
### Configuration
A default `bumpup.config.mjs` config file can be generated with `bumpup init`. It contains the plugins for a standard
'npm, git, semver' use case.

> The config file can have whatever name you want but it has to end with *.mjs because otherwise node tries to import 
> the config as a CommonJS Module.

#### bumpup.config.mjs
A configuration file is a ES Module with a configuration object as its default export. CommonJS Modules are not supported.

The most basic example (although not very useful because it contains no plugins) would be: 
```js
export default {
    version: "2.0.0",
    plugins: []
}
```

To add a plugin import it and add it to the plugin array:

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

To pass options to a plugin add an array with the plugin and its options instead of the plugin:
For a list of options supported by the plugin see the plugins doc. 

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
        [bump, {dry: true}],
        record,
    ]
}
```