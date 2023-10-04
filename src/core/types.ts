import { TypedDataField } from 'ethers'

export type Types = Record<string, Array<TypedDataField>>

export type Typename<TTypes extends Types = Types> = keyof TTypes extends string
	? keyof TTypes
	: never
