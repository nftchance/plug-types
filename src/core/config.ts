import { TypedData } from 'abitype'

import { constants } from '@/lib/constants'

type Contract = {
	authors: Array<string> | string
	name: string
	filename: string
	license: string
	solidity: string
}

type Dangerous = {
	excludeCoreTypes: boolean
	useOverloads: boolean
	useDocs: boolean
	packetHashName: (typeName: string) => string
}

export type Config = {
	contract: Contract
	types: TypedData
	out: string
	outDocs: string
	dangerous: Dangerous
}

export function config({
	contract,
	types,
	out,
	outDocs,
	dangerous
}: Partial<{
	contract: Partial<Contract>
	types: TypedData
	out: string
	outDocs: string
	dangerous: Partial<Dangerous>
}> = {}): Config {
	return {
		contract: {
			...{
				name: 'Types',
				filename: 'Types',
				license: 'MIT',
				solidity: '0.8.24'
			},
			...contract,
			authors: [
				'@nftchance',
				`@nftchance/plug-types (${
					new Date().toISOString().split('T')[0]
				})`
			]
				.concat(contract?.authors ?? [])
				.map(author => ` * @author ${author}`)
				.join('\n')
		},
		types:
			types !== undefined
				? {
						...constants.types,
						...types
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }
				: constants.types,
		out: out ?? `./dist/contracts/`,
		outDocs: outDocs ?? `./dist/docs/`,
		dangerous: {
			...{
				excludeCoreTypes: false,
				useOverloads: false,
				useDocs: false,
				packetHashName: (typeName: string) =>
					typeName.slice(0, 1).toUpperCase() + typeName.slice(1)
			},
			...dangerous
		}
	} as const
}
