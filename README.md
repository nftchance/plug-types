# @nftchance/emporium-types

![Header image](README.png)

Working with [EIP-712](https://eips.ethereum.org/EIPS/eip-712) signatures and types can be very confusing. Especially when you are working to create your own protocol rather than just writing a little bit of front-end code that interacts with something already deployed.

Historically when developing a protocol, the first step is to build the base consumers and mechanisms with strict focus. When working with modern intent protocols though, you must approach it from a different angle: `types first`.

Without `emporium-types`:

- 🚨 Writing `Solidity` contracts takes tens of hours and thousands of dollars.
- 🤔 EIP-712 confusion and complexities drag out timelines.
- 🤬 Constantly wonder why your signatures are not matching up.

With `emporium-types`:

- 🧩 Auto-generate your `Types contract`` and focus on the core protocol mechanisms.
- 🥹 Interact with an approachable API designed after the personal experience of EIP-712.
- ✅ Generate the `Solidity` using the same library used to manage signatures.
- 🚀 and several more small helper utilities. 

## Getting Started

`emporium-types` has been designed to get you up and running as fast as possible. With reasonable defaults you can choose to work with the values required to drive the `emporium` framework or extend them to fit your needs in the case that you are building a more integrated protocol.

### Installation

To install dependencies required to power `emporium-types` run:

```bash
bun install
```

### Solidity Generation

To generate the `Solidity` from your `EIP-712` types run:

```bash
bun emporium generate
    -o --output <filename> "Output path of generated Solidity." `./dist/contracts/Types.sol`
```

### Configuration

With the configuration file exposed you have the ability to directly control the Solidity and supporting documentation that is generated.

```typescript
// path: ./config.ts
import config from './src/config'

export const emporiumConfig = config({
    authors: ['<your name>']
}: Partial<{
	contract: {
		authors: Array<string>
		name: string
		license: string
		solidity: string
	}
	types: Record<string, Array<TypedDataField>>
	output: string
	dangerous: {
		excludeCoreTypes: boolean
	}
}>)
```

## Advanced Usage

In some cases you will want access to more than just the base `emporium` types of `Delegation`, `Invocations`, and all the supporting shapes. In this case, you need to extend the types and prepare your protocol to consume a framework that has already been initialized with all the confusing [EIP-712 declarations](https://eips.ethereum.org/EIPS/eip-712).

In this case, you will need to update the types that are used to generate the Solidity so that once again, you do not need to deal with the complexities of the standard and can focus on actually writing your protocol.

<!-- TODO: Need to write the implementation and documentation for this. -->

## Dangerous Usage

You can strip the configuration back to the absolute barebones so that the types for the `emporium` framework are not included in the generated files.