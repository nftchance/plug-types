export const DELEGATION_TYPES = {
	Delegation: [
		{ name: 'delegate', type: 'address' },
		{ name: 'authority', type: 'bytes32' },
		{ name: 'caveats', type: 'Caveat[]' }
	],
	Caveat: [
		{ name: 'enforcer', type: 'address' },
		{ name: 'terms', type: 'bytes' }
	]
} as const

export const INVOCATION_TYPES = {
	...DELEGATION_TYPES,
	Transaction: [
		{ name: 'to', type: 'address' },
		{ name: 'gasLimit', type: 'uint256' },
		{ name: 'data', type: 'bytes' }
	],
	SignedDelegation: [
		{ name: 'delegation', type: 'Delegation' },
		{ name: 'signature', type: 'bytes' },
		{ name: 'signerIsContract', type: 'bool' }
	],
	Invocation: [
		{ name: 'transaction', type: 'Transaction' },
		{ name: 'authority', type: 'SignedDelegation[]' }
	]
} as const

export const INVOCATIONS_TYPES = {
	...INVOCATION_TYPES,
	ReplayProtection: [
		{ name: 'nonce', type: 'uint256' },
		{ name: 'queue', type: 'uint256' }
	],
	Invocations: [
		{ name: 'batch', type: 'Invocation[]' },
		{ name: 'replayProtection', type: 'ReplayProtection' }
	]
} as const
