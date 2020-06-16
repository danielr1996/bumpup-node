# @bumpup/cli

This is the cli for bumpup

## Usage
### Installation
To use bumpup install it in your project
```shell script
npm install @bumpup/cli --save-dev
```

Then install the plugins that you'd like to use for the lifecycle steps.

You can use the official plugins under the `@bumpup` scope, or any other plugins that implements the lifecycle steps.

```shell script
npm install @bumpup/version-package-json @bumpup/type-git @bumpup/determine-semver @bumpup/package-json --save-dev
```

### Configuration
> Currently only `bumpup.json` is supported as configuration. 
> In a future version more configuration sources are planned to be supported, being merged in the following order:
> - sensible default (@bumpup/version-package-json, @bumpup/type-git, @bumpup/determine-semver, @bumpup/package-json)
> - `~/.bumpup.json`
> - as a key in `package.json`
> - `bumpup.json` (searching up to the filesystem root until a bumpup json is found, like package.json is found )
> - cli args (`npx bumpup --read ... --type ... --determine ... --bump ...`)

#### bumpup.json
Put a `bumpup.json` in your project specifing the plugins to use in your project folder next to your `package.json`.
> Even though each lifecycle step has an array of plugins currently only the first specified plugins plugin is used.
> It is planned for a future version to support multiple plugins per lifecycle steps.
```json
{
  "read": [
    {
      "reader": "@bumpup/version-package-json"
    }
  ],
  "type": [
    {
      "reader": "@bumpup/type-git"
    }
  ],
  "determine": [
    {
      "determiner": "@bumpup/determine-semver"
    }
  ],
  "bump": [
    {
      "bumper": "@bumpup/bump-package-json"
    }
  ]
}
```

Run `bumpup` from the same directory where the `bumpup.json`. You should get an output similiar to
```shell script
bumpup: current version is 1.14.0
bumpup: change type is minor
bumpup: new version is 1.15.0
Bumping version  1.15.0
Recording version  1.15.0
```
