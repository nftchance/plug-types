import { z } from 'zod'
import { Address, Bytes, Bytes32 } from './types'

export const FuseSchema = z.object({
	neutral: Address,
	live: Bytes
})

export type Fuse = z.infer<typeof FuseSchema>

export const PinSchema = z.object({
	neutral: Address,
	live: Bytes32,
	fuses: z.array(FuseSchema),
	salt: Bytes32
})

export type Pin = z.infer<typeof PinSchema>

export const CurrentSchema = z.object({
	ground: Address,
	voltage: z.bigint(),
	data: Bytes
})

export type Current = z.infer<typeof CurrentSchema>

export const LivePinSchema = z.object({
	pin: PinSchema,
	signature: Bytes
})

export type LivePin = z.infer<typeof LivePinSchema>

export const PlugSchema = z.object({
	current: CurrentSchema,
	pins: z.array(LivePinSchema)
})

export type Plug = z.infer<typeof PlugSchema>

export const BreakerSchema = z.object({
	nonce: z.bigint(),
	queue: z.bigint()
})

export type Breaker = z.infer<typeof BreakerSchema>

export const PlugsSchema = z.object({
	plugs: z.array(PlugSchema),
	breaker: BreakerSchema
})

export type Plugs = z.infer<typeof PlugsSchema>

export const LivePlugsSchema = z.object({
	plugs: PlugsSchema,
	signature: Bytes
})

export type LivePlugs = z.infer<typeof LivePlugsSchema>

export const EIP712DomainSchema = z.object({
	name: z.string(),
	version: z.string(),
	chainId: z.number(),
	verifyingContract: Address
})

export type EIP712Domain = z.infer<typeof EIP712DomainSchema>
