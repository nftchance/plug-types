import { Command } from 'commander'
import dedent from 'dedent'
import { default as fse } from 'fs-extra'
import { basename, resolve } from 'pathe'
import pc from 'picocolors'

import { find, format, load, usingTypescript } from '../lib/functions/config'
import { config } from './config'
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

		const isUsingTypescript = await usingTypescript()
		const rootDir = resolve(options.root || process.cwd())
		let outPath: string

		if (options.config) {
			outPath = resolve(rootDir, options.config)
		} else {
			const extension = isUsingTypescript ? 'ts' : 'js'
			outPath = resolve(rootDir, `emporium.config.${extension}`)
		}

		const defaultConfig = { out: './dist/contracts/' }

		let content: string
		if (isUsingTypescript) {
			const config = options.content ?? defaultConfig
			content = dedent(`
                import { config } from "@nftchance/emporium-types"

                // * With an empty config, default values will be used for all the fields
                //   when generating the Solidity smart contract. For basic usage, this is
                //   probably what you want. If have additional events or need to customize
                //   the static declarations of the contract, you can pass in a partial
                //   config object to override the default values.
                export default config(${JSON.stringify(config)})
            `)
		} else {
			const config = options.content ?? {
				...defaultConfig,
				out: defaultConfig.out.replace(/\.ts$/, '.js')
			}
			content = dedent(`
                // @ts-check
                
                // * With an empty config, default values will be used for all the fields
                //   when generating the Solidity smart contract. For basic usage, this is
                //   probably what you want. If have additional events or need to customize
                //   the static declarations of the contract, you can pass in a partial
                //   config object to override the default values.
                /** @type {import('@nftchance/emporium-types').Config} */
                export default ${JSON.stringify(config)}
            `)
		}

		// ! Run prettier so that we format out the stringified JSON.
		const formatted = await format(content)
		await fse.writeFile(outPath, formatted)

		console.info(
			pc.green(
				`✔︎ Generated Emporium configuration file at: \n\t ${pc.gray(
					outPath
				)}`
			)
		)
	})

program
	.command('generate')
	.option('-c --config <config>', 'Path to config file.')
	.option('-o, --output <output>', 'Path to the generated Solidity file.')
	.action(async options => {
		const configPath = await find({
			config: options.config,
			root: options.root
		})

		let configs
		const outNames = new Set<string>()

		if (configPath) {
			const resolvedConfigs = await load({ configPath })

			const isArrayConfig = Array.isArray(resolvedConfigs)

			if (isArrayConfig)
				console.info(
					`* Using config at index ${basename(pc.gray(configPath))}`
				)

			configs = isArrayConfig ? resolvedConfigs : [resolvedConfigs]
		} else {
			console.info(
				pc.yellow(
					`! Could not find Emporium configuration file. Using default.`
				)
			)

			configs = [config()]
		}

		for (const config of configs) {
			if (!config.out)
				throw new Error('No output path specified in config')

			if (outNames.has(config.out))
				throw new Error('Duplicate output path specified in config')

			outNames.add(config.out)

			await generate(config)
				.then(() =>
					console.info(
						pc.green(
							`✔︎ Generated Solidity code based on EIP-712 types to:\n\t${pc.gray(
								config.out
							)}`
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
		}
	})

program.parse()
