import { default as fse } from 'fs-extra'

const url = 'https://chainid.network/chains.json'

type Chain = {
	name: string
	chainId: number
}

const getChains = async () => {
	const response = await fetch(url)

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message || 'Failed to fetch chains')
	}

	return data
}

const getWithinRange = (chains: Chain[]) => {
	const support: Record<
		string,
		{ percent: string; unsupported: Array<Chain> }
	> = {}

	const withinRange = (chainId: number, range: number) => {
		return chainId <= 2 ** range - 1
	}

	for (let i = 16; i <= 64; i += 4) {
		support[`withinMaxUint${i}`] = {
			percent: `${
				(chains.filter((chain: Chain) => withinRange(chain.chainId, i))
					.length /
					chains.length) *
				100
			}%`,
			unsupported: chains.filter(
				(chain: Chain) => !withinRange(chain.chainId, i)
			)
		}
	}

	return support
}

getChains()
	.then(data => {
		const chains = data
			.map((chain: any) => ({
				name: chain.name,
				chainId: chain.chainId
			}))
			.sort((a: Chain, b: Chain) => a.chainId - b.chainId)

		chains.unshift(getWithinRange(chains))

		fse.writeJSON('chains.json', chains, { spaces: 2 })
	})
	.catch(error => {
		console.error(error)
	})
