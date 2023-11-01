import { Config } from '@/core/config'

const EIP712_TYPES = {
	EIP712Domain: [
		{ name: 'name', type: 'string' },
		{ name: 'version', type: 'string' },
		{ name: 'chainId', type: 'uint256' },
		{ name: 'verifyingContract', type: 'address' }
	]
} as const

const PERMISSION_TYPES = {
	Caveat: [
		{ name: 'enforcer', type: 'address' },
		{ name: 'terms', type: 'bytes' }
	],
	Permission: [
		{ name: 'delegate', type: 'address' },
		{ name: 'authority', type: 'bytes32' },
		{ name: 'caveats', type: 'Caveat[]' },
		{ name: 'salt', type: 'bytes32' }
	]
} as const

const INTENT_TYPES = {
	...PERMISSION_TYPES,
	Transaction: [
		{ name: 'to', type: 'address' },
		{ name: 'gasLimit', type: 'uint256' },
		{ name: 'data', type: 'bytes' }
	],
	SignedPermission: [
		{ name: 'permission', type: 'Permission' },
		{ name: 'signature', type: 'bytes' }
	],
	Intent: [
		{ name: 'transaction', type: 'Transaction' },
		{ name: 'authority', type: 'SignedPermission[]' }
	]
} as const

const INTENTS_TYPES = {
	...INTENT_TYPES,
	ReplayProtection: [
		{ name: 'nonce', type: 'uint256' },
		{ name: 'queue', type: 'uint256' }
	],
	Intents: [
		{ name: 'batch', type: 'Intent[]' },
		{ name: 'replayProtection', type: 'ReplayProtection' }
	]
} as const

const SIGNED_INTENT_TYPES = {
	...INTENTS_TYPES,
	SignedIntents: [
		{ name: 'intents', type: 'Intents' },
		{ name: 'signature', type: 'bytes' }
	]
} as const

export const constants = {
	config: {
		contract: {
			name: 'Temp',
			license: 'BUSL-1.1',
			solidity: '^0.8.19',
			authors: []
		},
		types: EIP712_TYPES,
		dangerous: {
			useOverloads: false,
			useDocs: false,
			packetHashName: (typeName: string) => typeName,
			excludeCoreTypes: false
		},
		out: './temp',
		outDocs: './temp/docs'
	} as Config,
	types: {
		...SIGNED_INTENT_TYPES
	}
} as const
