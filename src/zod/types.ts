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

const mapping = [
	// * Basic types
	['bool', 'z.boolean()'],
	['string', 'z.string()'],

	// * Format dependent types
	['address', 'Address'],
	['bytes', 'Bytes'],
	['bytes32', 'Bytes32'],

	// * Regex dependent types such as uint and int
	// `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
	// https://regexr.com/6v8hp
	[
		/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/,
		'z.number()'
	]
] as const

export const getTypeSchema = (type: string): string => {
	if (type.includes('[]')) {
		return `z.array(${getTypeSchema(type.replace('[]', ''))})`
	}

	for (const [regex, schema] of mapping) {
		if (typeof regex === 'string') {
			if (regex === type) return schema
		} else if (regex.test(type)) return schema
	}

	return `${type}Schema`
}
