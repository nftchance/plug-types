import { TypedData } from 'abitype'

import { readFileSync } from 'fs'

import { INVOCATIONS_TYPES } from '../lib/constants'

type Contract = {
	authors: Array<string> | string
	name: string
	license: string
	solidity: string
}

type Dangerous = {
	excludeCoreTypes: boolean
	useOverloads: boolean
	packetHashName: (typeName: string) => string
}

export type Config = {
	contract: Contract
	types: TypedData
	out: string
	dangerous: Dangerous
}

const { version: LIBRARY_VERSION } = JSON.parse(
	readFileSync('./package.json', 'utf8')
)

export function config({
	contract,
	types,
	out,
	dangerous
}: Partial<{
	contract: Partial<Contract>
	types: TypedData
	out: string
	dangerous: Partial<Dangerous>
}> = {}): Config {
	return {
		contract: {
			...{
				name: 'Types',
				license: 'BUSL-1.1',
				solidity: '^0.8.19'
			},
			...contract,
			authors: [
				'@nftchance',
				`emporium-types@${LIBRARY_VERSION} (${
					new Date().toISOString().split('T')[0]
				})`,
				'@danfinlay (https://github.com/delegatable/delegatable-sol)'
			]
				.concat(contract?.authors ?? [])
				.map(author => ` * @author ${author}`)
				.join('\n')
		},
		types:
			types !== undefined
				? {
						...INVOCATIONS_TYPES,
						...types
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }
				: INVOCATIONS_TYPES,
		out: out ?? `./dist/contracts/${contract?.name ?? 'Types'}.sol`,
		dangerous: {
			...{
				excludeCoreTypes: false,
				useOverloads: true,
				packetHashName: (typeName: string) =>
					typeName.slice(0, 1).toUpperCase() + typeName.slice(1)
			},
			...dangerous
		}
	} as const
}
