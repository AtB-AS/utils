# @atb-as/utils

Shared typescript utility methods and types for AtB products.

## Install

```
yarn add @atb-as/utils
```

## Local development

In order to test local changes to the package locally, you can use [yalc](https://github.com/wclr/yalc). This is an alternative to `yarn link`, that works better with React Native / metro.

1. Run `npm i yalc -g` to install yalc on your machine.
2. Run `yarn build && yalc push` to set up a local link to this package.
3. Run `yalc add @atb-as/utils` in the project that depends on it.

Your local changes to `@atb-as/utils` should now be available to use. When you make more changes locally, you can run `yarn build && yalc push` again to update the linked package.

When you're done, run `yalc remove --all` to reset the project's `package.json`.

## Release

1. Merge a PR to main, where the commit message follows the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/).
2. The Github action `release-please-action` will create a PR to update the package version and changelog.
  - `feat` will be a minor release.
  - `fix` will be a patch release.
  - Adding `!` after the prefix (e.g. `feat!`) means it is a breaking change, and will be a major release. This includes any changes to the public API that requires users of the package to update any code.
  - Other prefixes such as `chore` or `refactor` will not trigger a release.
3. Merge the release PR to main to trigger a NPM release.

For more details, see [release-please-action](https://github.com/googleapis/release-please-action).

## License

EUPL-1.2
