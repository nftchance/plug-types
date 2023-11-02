import { Address, SolidityBytes, SolidityInt } from 'abitype/zod'

import { z } from 'zod'

export const CaveatSchema = z.object({
	enforcer: Address,
	terms: SolidityBytes
})

export type Caveat = z.infer<typeof CaveatSchema>

export const PermissionSchema = z.object({
	delegate: Address,
	authority: SolidityBytes,
	caveats: z.array(CaveatSchema),
	salt: SolidityBytes
})

export type Permission = z.infer<typeof PermissionSchema>

export const TransactionSchema = z.object({
	to: Address,
	gasLimit: SolidityInt,
	data: SolidityBytes
})

export type Transaction = z.infer<typeof TransactionSchema>

export const SignedPermissionSchema = z.object({
	permission: PermissionSchema,
	signature: SolidityBytes
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
	signature: SolidityBytes
})

export type SignedIntents = z.infer<typeof SignedIntentsSchema>
