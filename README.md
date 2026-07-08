# @atb-as/utils

Shared typescript utility methods and types for AtB products.

## Install

```
pnpm add @atb-as/utils
```

## Local development

In order to test changes to this package without making a release, use `pnpm add file:<path-to-utils>` (e.g. `pnpm add file:../utils`) in the project that depends on it.

It will use the built version of the package, so make sure to run `pnpm build` when setting it up, and whenever you make changes.

When you're done, set the package version in package.json back to the previous version.

## Release

1. Merge a PR to main, where the commit message follows the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/).
2. The Github action `release-please-action` will create a PR to update the package version and changelog.
  - `feat` will be a minor release.
  - `fix` will be a patch release.
  - Adding `!` after the prefix (e.g. `feat!`) means it is a breaking change, and will be a major release. This includes any changes to the public API that requires users of the package to update any code.
  - Other prefixes such as `chore` or `refactor` will not trigger a release.
3. Merge the release PR to main to trigger a NPM release.

> [!NOTE]
> In case you want to create a release with a different version number than the one suggested by release-please, you can make an empty commit on master with commit message on this format:
> ```
> chore: release v1.2.3
>
> release-as: 1.2.3
> ```

For more details, see [release-please-action](https://github.com/googleapis/release-please-action).

## License

EUPL-1.2
