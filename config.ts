import config from './src/config'

// * With an empty config, default values will be used for all the fields
//   when generating the Solidity smart contract. For basic usage, this is
//   probably what you want. If have additional events or need to customize
//   the static declarations of the contract, you can pass in a partial
//   config object to override the default values.
export const emporiumConfig = config({})

// ! Is exported as `emporiumConfig` so that you can include the instantiation
//   in the existing 'config' stack your codebase likely already has.
