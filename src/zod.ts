import { z } from 'zod'
import { Address, SolidityInt, SolidityBytes } from 'abitype/zod'

export const CaveatSchema = z.object({
	enforcer: Address,
	terms: SolidityBytes
})

export type Caveat = z.infer<typeof CaveatSchema>

export const DelegationSchema = z.object({
	delegate: Address,
	authority: SolidityBytes,
	caveats: z.array(CaveatSchema),
	salt: SolidityBytes
})

export type Delegation = z.infer<typeof DelegationSchema>

export const TransactionSchema = z.object({
	to: Address,
	gasLimit: SolidityInt,
	data: SolidityBytes
})

export type Transaction = z.infer<typeof TransactionSchema>

export const SignedDelegationSchema = z.object({
	delegation: DelegationSchema,
	signature: SolidityBytes
})

export type SignedDelegation = z.infer<typeof SignedDelegationSchema>

export const InvocationSchema = z.object({
	transaction: TransactionSchema,
	authority: z.array(SignedDelegationSchema)
})

export type Invocation = z.infer<typeof InvocationSchema>

export const ReplayProtectionSchema = z.object({
	nonce: SolidityInt,
	queue: SolidityInt
})

export type ReplayProtection = z.infer<typeof ReplayProtectionSchema>

export const InvocationsSchema = z.object({
	batch: z.array(InvocationSchema),
	replayProtection: ReplayProtectionSchema
})

export type Invocations = z.infer<typeof InvocationsSchema>

export const SignedInvocationsSchema = z.object({
	invocations: InvocationsSchema,
	signature: SolidityBytes
})

export type SignedInvocations = z.infer<typeof SignedInvocationsSchema>
