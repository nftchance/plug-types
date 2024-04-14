import { z } from 'zod'
import { Address, Bytes, Bytes32 } from './types'

export const PlugSchema = z.object({
    target: Address,
    value: z.bigint(),
    data: Bytes
})

export type Plug = z.infer<typeof PlugSchema>

export const PlugsSchema = z.object({
    socket: Address,
    plugs: z.array(PlugSchema),
    solver: Bytes,
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
