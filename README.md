# @nftchance/emporium-types

Working with [EIP-712](https://eips.ethereum.org/EIPS/eip-712) signatures and types can be very confusing. Especially when you are working to create your own protocol rather than just writing a little bit of front-end code that interacts with something already deployed.

![Header image](https://github.com/nftchance/emporium-types/blob/6aca329b4a75a50696b0b3ce241e00686c9f7ca3/README.png)

Without `emporium-types`:

- 🚨 Writing +1K line `Solidity` contracts costs `$$$`.
- 🤔 `EIP-712` complexities drag out timelines.
- 🤬 Constantly wonder why your signatures don't work.

With `emporium-types`:

- 🧩 Auto-generate your `Types contract` in seconds.
- 🥹 An approachable API designed after the personal experience of `EIP-712`.
- ✅ Generate the decoders using the same method as the encoder.
- 🚀 and several more small helper utilities.

Historically when developing an onchain EVM protocol, the first step is to build the base consumers and mechanisms with strict focus. When working with modern intent protocols though, you must approach it from a different angle: `types first`.

## Getting Started

`emporium-types` has been designed to get you up and running as fast as possible. With reasonable defaults you can choose to work with the values required to drive the `emporium` framework or extend them to fit your needs in the case that you are building a more integrated protocol.

### Installation

To install `emporium-types` run:

```bash
npm install @nftchance/emporium-types
```

### Configuration

Due to the default configuration, if you do not create a `emporium.config.ts` then the library will proceed with the use of the defaults. However, with the configuration file exposed you have the ability to directly control the Solidity and supporting documentation that is generated.

To generate an `emporium.config.ts` file run: 

```bash
npm emporium init
```

or you also have the option of creating the file yourself. `init` functionality is intended to enable the ability for build-time compilation so that you can use this one configuration through each piece of EIP-712 consuming stack.

```typescript
// path: ./emporium.config.ts
import { config } from '@nftchance/emporium-types'

export default config({
    contract: { 
        authors: ['<your name>']
    },
    out: './dist/contracts/'
})
```

### Solidity Generation

To run the `Solidity` generation based on the configuration provided:

```bash
npm emporium generate
    -o --output <filename> "Output path of generated Solidity." `./dist/contracts/Types.sol`
```

The output file will contain:

- An interface that contains the structs required to power verification of the `EIP-712` types.
- An abstract contract that contains:
  - The `constant` type hash of each data type.
  - Optionally overloaded packet hash getters to verify and decode signature messages with arguments matching the generated data types.
- All the pieces required to power the most up to date version of the `emporium` framework.

## Advanced Usage (Adding Your Types)

In some cases you will want access to more than just the base `emporium` types of `Delegation`, `Invocations`, and all the supporting shapes such as `Transaction`, `ReplayProtection`, etc. In this case, you need to extend the types and prepare your protocol to consume a framework that has already been initialized with all the confusing [EIP-712 data types and decoders](https://eips.ethereum.org/EIPS/eip-712) taken care of.

> **Important**
> If you are at this level, it is assumed that you are familiar with `EIP-712` -- verification of signatures can be very complex.  
>
> If you are having trouble verifying your signatures I recommend taking the `types first` approach so that you can take have a clear understanding of where an issues may be arising. It is highly unlikely that something is wrong with the library you are using and much more likely that something with the declaration of the type, its hash or the body being used when signing a signature of that type.
>
> You can find a few functional examples in the tests of this repository and `emporium-lib` if you are curious of a more in-depth process of verification.

By default, when you providing your own types they will be loaded alongside the core `emporium` framework types so that you can make your protocol intent-based without any work beyond the normal scope (yes, really, no additional work -- it's pretty cool, right?)

To illustrate this, let's look at a quick example where we are signing `Mail` messages from one party to another.

```typescript
// path: ./lib/constants.ts
export const types = {
    Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' }
    ],
    Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' }
    ]
};
```

With this configuration, we have the types needed to send `Mail` from one `Wallet` to another.

*Why would you need this?* Viewing these types through the lens of an intent framework, a simple mental model is one where someone has swiped right on Tinder, but the recipient has to pay to execute and decode the contents (who swiped). The person that swiped right can do this without paying any cost as the receiver will be the executor. This is just one very simple example.

With our types declared, we will initialize the `emporium-types` config with the `EIP-712` data types that we have just declared.

```typescript
// path: ./emporium.config.ts
import { config } from '@nftchance/emporium-types'

import { types } from "./lib/constants.ts"

export const emporiumConfig = config({
    contract: { 
        authors: ['<your name>']
    },
    out: './dist/contracts/',
    types
})
```

With this simple addition to your configuration file you are ready to go. Generate your `Types.sol` with `npm emporium generate` and go focus on the core mechanisms of your protocol.