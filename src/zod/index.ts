import { z } from 'zod'
import { Address, Bytes, Bytes32 } from './types'

export const CurrentSchema = z.object({
	target: Address,
	value: z.bigint(),
	data: Bytes
})

export type Current = z.infer<typeof CurrentSchema>

export const FuseSchema = z.object({
	target: Address,
	data: Bytes
})

export type Fuse = z.infer<typeof FuseSchema>

export const PlugSchema = z.object({
	current: CurrentSchema,
	fuses: z.array(FuseSchema),
	enforcementGasLimit: z.bigint(),
	currentGasLimit: z.bigint(),
	maxFeePerGas: z.bigint(),
	maxPriorityFeePerGas: z.bigint()
})

export type Plug = z.infer<typeof PlugSchema>

export const PlugsSchema = z.object({
	plugs: z.array(PlugSchema),
	salt: Bytes32
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
