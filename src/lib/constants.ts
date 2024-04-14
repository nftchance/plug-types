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

export const PLUGS_TYPES = {
	Plug: [
		{ name: 'target', type: 'address' },
		{ name: 'value', type: 'uint256' },
		{ name: 'data', type: 'bytes' }
	],
	Plugs: [
		{ name: 'socket', type: 'address' },
		{ name: 'plugs', type: 'Plug[]' },
		{ name: 'solver', type: 'bytes' },
		{ name: 'salt', type: 'bytes32' }
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
			filename: 'Temp',
			license: 'MIT',
			solidity: '0.8.24',
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
