import { Config } from '@/core/config'

export const BASE_AUTH =
	'0x0000000000000000000000000000000000000000000000000000000000000000'

export const EIP712_TYPES = {
	EIP712Domain: [
		{ name: 'name', type: 'string' },
		{ name: 'version', type: 'string' },
		{ name: 'chainId', type: 'uint256' },
		{ name: 'verifyingContract', type: 'address' }
	]
} as const

export const PIN_TYPES = {
	Fuse: [
		{ name: 'neutral', type: 'address' },
		{ name: 'live', type: 'bytes' }
	],
	Pin: [
		{ name: 'neutral', type: 'address' },
		{ name: 'live', type: 'bytes32' },
		{ name: 'fuses', type: 'Fuse[]' },
		{ name: 'salt', type: 'bytes32' }
	]
} as const

export const PLUG_TYPES = {
	...PIN_TYPES,
	Current: [
		{ name: 'ground', type: 'address' },
		{ name: 'voltage', type: 'uint256' },
		{ name: 'data', type: 'bytes' }
	],
	LivePin: [
		{ name: 'pin', type: 'Pin' },
		{ name: 'signature', type: 'bytes' }
	],
	Plug: [
		{ name: 'current', type: 'Current' },
		{ name: 'pins', type: 'LivePin[]' }
	]
} as const

export const PLUGS_TYPES = {
	...PLUG_TYPES,
	Breaker: [
		{ name: 'nonce', type: 'uint256' },
		{ name: 'queue', type: 'uint256' }
	],
	Plugs: [
		{ name: 'plugs', type: 'Plug[]' },
		{ name: 'breaker', type: 'Breaker' }
	]
} as const

export const LIVE_PLUGS_TYPES = {
	...PLUGS_TYPES,
	LivePlugs: [
		{ name: 'plugs', type: 'Plugs' },
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
		...LIVE_PLUGS_TYPES
	}
} as const
