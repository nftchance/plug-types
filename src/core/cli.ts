import { Command } from 'commander'
import pc from 'picocolors'

// import * as logger from '../lib/logger'
import { find } from '../lib/functions/config'
import { generate } from './sol'

const program = new Command()

program
	.name('emporium')
	.description('A tool for generating code for the Emporium framework.')

program
	.command('init')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(async options => {
		const configPath = await find({
			config: options.config,
			root: options.root
		})

		if (configPath) {
			console.info(
				pc.blue(
					`* Found Emporium configuration file at: \n\t ${pc.gray(
						configPath
					)}`
				)
			)
			return
		}

		console.log(configPath)
	})

program
	.command('generate')
	.option('-o, --output <output>', 'Path to the generated Solidity file.')
	.action(async options => {
		await generate(options.filename)
			.then(() =>
				console.info(
					pc.green(
						'✔︎ Generated Solidity code based on EIP-712 types.'
					)
				)
			)
			.catch(error => {
				console.error(
					pc.red(
						'✘ Failed to generate Solidity code based on EIP-712 types.'
					)
				)

				console.error(pc.red(error))
			})
	})

program.parse()
