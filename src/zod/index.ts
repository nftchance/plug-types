import { SolidityInt } from 'abitype/zod'

import { z } from 'zod'

import { Address, Bytes, Bytes32 } from './types'

export const CaveatSchema = z.object({
	enforcer: Address,
	terms: Bytes
})

export type Caveat = z.infer<typeof CaveatSchema>

export const PermissionSchema = z.object({
	delegate: Address,
	authority: Bytes32,
	caveats: z.array(CaveatSchema),
	salt: Bytes32
})

export type Permission = z.infer<typeof PermissionSchema>

export const TransactionSchema = z.object({
	to: Address,
	gasLimit: SolidityInt,
	data: Bytes
})

export type Transaction = z.infer<typeof TransactionSchema>

export const SignedPermissionSchema = z.object({
	permission: PermissionSchema,
	signature: Bytes
})

export type SignedPermission = z.infer<typeof SignedPermissionSchema>

export const IntentSchema = z.object({
	transaction: TransactionSchema,
	authority: z.array(SignedPermissionSchema)
})

export type Intent = z.infer<typeof IntentSchema>

export const ReplayProtectionSchema = z.object({
	nonce: SolidityInt,
	queue: SolidityInt
})

export type ReplayProtection = z.infer<typeof ReplayProtectionSchema>

export const IntentsSchema = z.object({
	batch: z.array(IntentSchema),
	replayProtection: ReplayProtectionSchema
})

export type Intents = z.infer<typeof IntentsSchema>

export const SignedIntentsSchema = z.object({
	intents: IntentsSchema,
	signature: Bytes
})

export type SignedIntents = z.infer<typeof SignedIntentsSchema>

export const EIP712DomainSchema = z.object({
	name: z.string(),
	version: z.string(),
	chainId: SolidityInt,
	verifyingContract: Address
})

export type EIP712Domain = z.infer<typeof EIP712DomainSchema>
