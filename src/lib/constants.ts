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

export const PLUG_TYPES = {
	Current: [
		{ name: 'ground', type: 'address' },
		{ name: 'voltage', type: 'uint256' },
		{ name: 'data', type: 'bytes' }
	],
	Fuse: [
		{ name: 'neutral', type: 'address' },
		{ name: 'live', type: 'bytes' }
	],
	Plug: [
		{ name: 'current', type: 'Current' },
		{ name: 'fuses', type: 'Fuse[]' }
	]
} as const

export const LIVE_PLUGS_TYPES = {
	...PLUG_TYPES,
	Plugs: [
		{ name: 'plugs', type: 'Plug[]' },
		{ name: 'salt', type: 'bytes32' }
	],
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
			solidity: '0.8.23',
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
