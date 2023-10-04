import { TypedDataField } from 'ethers'

import { readFileSync } from 'node:fs'

import { INVOCATIONS_TYPES } from '../lib/constants'

const { version: LIBRARY_VERSION } = JSON.parse(
	readFileSync('./package.json', 'utf8')
)

export default function config({
	contract,
	types,
	output,
	dangerous
}: Partial<{
	contract: {
		authors: Array<string>
		name: string
		license: string
		solidity: string
	}
	types: Record<string, Array<TypedDataField>>
	output: string
	dangerous: {
		excludeCoreTypes: boolean
	}
}>) {
	// TODO: Implement this.
	dangerous

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
		types: {
			...INVOCATIONS_TYPES,
			...types
		},
		output: output ?? `./dist/contracts/${contract?.name ?? 'Types'}.sol`
	}
}
