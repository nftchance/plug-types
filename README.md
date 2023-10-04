# @nftchance/emporium-types

![Header image](README.png)

<!-- TODO: Why? -->

## Getting Started

`emporium-types` has been designed to be as hands-off as possible. With reasonable defaults pre-loaded you can choose to work with the default values or extend them to fit your needs in the case that you are building a more complex protocol.

### Installation

To install dependencies required to power `emporium-types` run:

```bash
bun install
```

## Basic Usage

To generate the `Solidity` from your `EIP-712` types run:

```bash
bun emporium generate
    -o --output <filename> "Output path of generated Solidity." `./dist/contracts/Types.sol`
```

## Advanced Usage

In some cases you will want acces to more than just the base `emporium` types of `Delegation`, `Invocations`, and all the supporting shapes. In this case, you need to extend the types and prepare your protocol to consume a framework that has already been initialized with all the confusing [EIP-712 declarations](https://eips.ethereum.org/EIPS/eip-712).

In this case, you will need to update the types that are used to generate the Solidity so that once again, you do not need to deal with the complexities of the standard and can focus on actually writing your protocol.

<!-- TODO: Need to write the implementation and documentation for this. -->