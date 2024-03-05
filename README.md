# 🔌 Plug Types

> [!NOTE]
> This repository is a submodule of the larger [Plug monorepo](https://github.com/nftchance/plug) that contains all the required pieces to run the entire Plug stack yourself.

The `types` package of Plug is a separate piece of the repository that contains the key building blocks to manage the EIP712 types both onchain and offchain. Using automated generation these types operate as the base of the shape definition through all pieces of the broader monorepo.

## Dependencies

In order to run `@nftchance/plug-types` it is necessary to install all of the following dependencies first:

```ml
└─ pnpm — "Efficient package manager for Node modules."
```

## Getting Started

To run an hot-reloading instance of `@nftchance/plug-types` during development is incredibly straightforward. Open your terminal and run:

```bash
pnpm i
pnpm dev
```

## Publishing

The deployable package is automatically managed by `changesets` enabling the ability to publish the later version of the library through a pull request. Notably, you do not need to run anything yourself to do this outside of creating a changeset when there is a key change that end-users should be aware of. Not all changes require a changeset, but when they do you can generate one with:

```bash
pnpm changeset add
```
