import { z } from 'zod'

// * Parse an address.
export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
export const Address = z.string().transform((val, ctx) => {
	if (!ADDRESS_REGEX.test(val)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Invalid Address ${val}`
		})
	}

	return val as `0x${string}`
})

export type AddressType = z.infer<typeof Address>

// * Parse a bytes32 as a hex string.
export const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
export const Bytes32 = z.string().transform((val, ctx) => {
	if (!BYTES32_REGEX.test(val)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Invalid Bytes32 ${val}`
		})
	}

	return val as `0x${string}`
})

export type Bytes32Type = z.infer<typeof Bytes32>

// * Parse a bytes as a hex string.
export const BYTES_REGEX = /^0x[a-fA-F0-9]+$/
export const Bytes = z.string().transform((val, ctx) => {
	if (!BYTES_REGEX.test(val)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Invalid Bytes ${val}`
		})
	}

	return val as `0x${string}`
})

export type BytesType = z.infer<typeof Bytes>
