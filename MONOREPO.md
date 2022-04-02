## Add package to workspace root

E.g. `eslint`, `eslint-config-hexo` and `mocha` are shared across all packages.

```sh
pnpm add eslint -D -w
# -w means eslint will be added to workspace root
```

## Remove package from all packages

During the migration, I need to uninstall `eslint` from each packages, so I use `-r` flag of pnpm:

```sh
pnpm remove eslint -D -r
```

## Add package to a specific package

E.g. `0x` is only depended by `hexo` package.

```sh
pnpm add 0x -D --filter hexo
# --filter flag determines which workspace will be affected
```

You can also execute `pnpm add` directly under a package directory:

```sh
cd packages/hexo
pnpm add 0x -D
cd ../..
# It is exactly the same as "pnpm add 0x -D --filter hexo"
```

## Resolve monorepos from each other

E.g. during migration, I need to resolve `hexo` and `hexo-util` from each other.

```sh
pnpm remove hexo-util --filter hexo
# Here I remove hexo-util from hexo
# And I add hexo-util to packages/ folder
pnpm add hexo-util --filter hexo
# Now I re-add hexo-util into hexo
# pnpm will automatically resolve hexo-util from monorepo
```

## Publish packages

1. Change all packages' package.json version first
2. `pnpm -r publish`. pnpm will publish all packages with their version replaced:

```diff
- "hexo-util": "workspace:*"
+ "hexo-util": "npm:hexo-util@2.6.1"
```

3. publish specfic packages is also possible through `--filter` flag

## Testing

We are using [turbo](https://turborepo.org/) for testing (and building, in the future).

`turbo` is installed as a dependency of workspace root, which means its binary is located under `node_modules/.bin/turbo`. We should use `pnpm` to call it:

```sh
pnpm turbo run test
# or pnpx turbo run test
```

turbo will run `pnpm run test` for each packages. And turbo will determine the order automatically (E.g. hexo-util is a dependency of hexo, so `hexo-util:test` will be run first, then `hexo:test`).

To simplify the usage, I have added `turbo run test` and `turbo run eslint` to the root `package.json`. So we can just run `pnpm run test` at the root of the workspace.
