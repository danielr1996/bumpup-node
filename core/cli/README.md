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
  -f, --file <config-file>  which config file to read (default: "bumpup.config.mjs")
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