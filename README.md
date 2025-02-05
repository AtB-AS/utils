# @atb-as/utils

Shared typescript utility methods and types for AtB products.

## Install

```
yarn add @atb-as/utils
```

## Release

1. Merge a PR to main, where the commit message follows the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/).
2. The Github action `release-please-action` will create a PR to update the package version and changelog.
  - `feat` will be a minor release.
  - `fix` will be a patch release.
  - Adding `!` after the prefix (e.g. `feat!`) means it is a breaking change, and will be a major release. This includes any changes to the public API that requires users of the package to update any code.
  - Other prefixes such as `chore` or `refactor` will not trigger a release.
3. Merge the release PR to main to trigger a NPM release.

For more details, see [release-please-action](https://github.com/marketplace/actions/release-please-action).

## License

EUPL-1.2
