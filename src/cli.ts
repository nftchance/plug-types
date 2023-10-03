import { Command } from 'commander'

import { generate } from './sol'

const program = new Command()

program
	.name('emporium')
	.description('A tool for generating code for the Emporium framework.')

program
	.command('generate')
	.option('-o, --output <output>', 'Path to the generated solidity file.')
	.action(async options => {
		await generate(options.filename || './build/contracts/Types.sol')
			.then(() =>
				console.log(
					'✔︎ Generated Solidity code based on EIP-712 types.'
				)
			)
			.catch(error => {
				console.error(
					'✘ Failed to generate Solidity code based on EIP-712 types.'
				)

				console.error(error)
			})
	})

program.parse()
