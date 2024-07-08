# 🔌 Plug Types

> [!NOTE]
> This repository is a submodule of the larger [Plug monorepo](https://github.com/nftchance/plug) that contains all the required pieces to run the entire Plug stack yourself.

The `types` package of Plug is a separate piece of the repository that contains the key building blocks to create and verify signatures that consume the EIP712 types both onchain and offchain. Using automated generation these types operate as the base of the shape definition through all pieces of the broader monorepo.

## Dependencies

In order to run `@nftchance/plug-types` it is necessary to install all of the following dependencies first:

```ml
└─ pnpm — "Efficient package manager for Node modules."
```

## Developer Usage

In practice, the usage of this package should be exceptionally minimal when in isolated environments. Really, this package is intended to be used in a greater setting where your generated `Types.sol` smart contract is inherited into a larger framework. During generation `solady` is used to recover the signer of a message from the deterministic `EIP712` digest.

When using `foundry` it is recommended that you use `node_modules` to manage your dependencies as submodules are a terrible pattern to follow and offer subpar user experience. To do this, you will update your `foundry.toml` file to include the following:

```toml
[profile.default]
    remappings = [
        "solady/=node_modules/solady/src/",
    ]
```

With this taken care of you have two options:

1. Use the `Types.sol` smart contract distributed with this package.
2. Generate your own `Types.sol` smart contract using the `plug init` command followed by `plug generate` after you have defined your desired `plug.config.ts` file.

## Building & Publishing

When you've made changes to the repository you will need to build the package so that it can be distributed to your users. To do this you can run the following command:

```bash
pnpm build
```

This will generate the `dist` folder which contains the `Types.sol` smart contract and the `index.js` file that is the entrypoint for the package.

The deployable package is automatically managed by `changesets` enabling the ability to publish the later version of the library through a pull request. Notably, you do not need to run anything yourself to do this outside of creating a changeset when there is a key change that end-users should be aware of. Not all changes require a changeset, but when they do you can generate one with:

```bash
pnpm changeset add
```
