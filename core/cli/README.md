# @bumpup/cli
[![npm version](https://badge.fury.io/js/%40bumpup%2Fcli.svg)](https://badge.fury.io/js/%40bumpup%2Fcli)

This is the cli for bumpup

## Quickstart 
```shell script
npm install @bumpup/cli --save-dev
npx bumpup init
npx bumpup
```

## Usage
To see all options and commands run `bumpup --help` or `bumpup <subcommands> help`

### Options and commands
#### bumpup bump
> For convenience the `bump` subcommand can be executed with just `bumpup` too.

```shell script
$ bumpup bump --help
Usage: bumpup bump [options]

bumps up the version

Options:
  -d, --dry                 executes all plugins in dry mode, preventing potentially destructive operations (default: false)
  -p, --pre                 do a prerelease (default: false)
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
  -d, --dry                 executes all plugins in dry mode, preventing potentially destructive operations (default: false)
  -P, --save-prod           packages will appear in your `dependencies` (default: false)
  -s, --skip-install        skip install of packages (default: false)
  -h, --help                display help for command

```

#### bumpup --version
Display the current version of @bumpup/cli
```shell script
$ npx bumpup --version
2.3.1
```

### Configuration
A default `bumpup.config.mjs` config file can be generated with `bumpup init`. It contains the plugins for a standard
'npm, git, semver' use case.

> The config file can have whatever name you want, but it has to end with *.mjs because otherwise node tries to import 
> the config as a CommonJS Module.

#### bumpup.config.mjs
A configuration file is an ES Module with a configuration object as its default export. CommonJS Modules are not supported.

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
import {type, record} from '@bumpup/type-git-tags';
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
import {type, record} from '@bumpup/type-git-tags';
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

##### Inline Plugins
Because the configuration is just plain javascript it is also possible to specify a plugin inline. 
This might be usefull if you want to debug the workflow or slightly alter a plugins behaviour without writing an complete plugin for it.

A simple inline plugin that just logs the options and data looks like this:

```js
import version from '@bumpup/version-package-json';
import {type, record} from '@bumpup/type-git-tags';
import bump from '@bumpup/bump-package-json';
import determine from '@bumpup/determine-semver';

export default {
    version: "2.0.0",
    plugins: [
        options => data => {
            console.log(options, data);
        }
    ]
}
```