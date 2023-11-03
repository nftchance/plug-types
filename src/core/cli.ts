import { Command } from 'commander'
import dedent from 'dedent'
import { ensureDir, default as fse } from 'fs-extra'
import { basename, dirname, resolve } from 'pathe'
import pc from 'picocolors'

import { config } from '@/core/config'
import { generate } from '@/core/sol'
import { EIP712_TYPES } from '@/lib/constants'
import { find, format, load, usingTypescript } from '@/lib/functions/config'
import { getTypeSchema } from '@/zod/types'

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

		const defaultConfig = {
			out: './dist/contracts/',
			outDocs: './dist/docs/'
		}

		let content: string
		if (isUsingTypescript) {
			const config = options.content ?? defaultConfig
			content = dedent(`
                import { config } from "@nftchance/emporium-types"

                export default config(${JSON.stringify(config)})
            `)
		} else {
			const config = options.content ?? {
				...defaultConfig,
				out: defaultConfig.out.replace(/\.ts$/, '.js')
			}
			content = dedent(`
                // @ts-check
                
                /** @type {import('@nftchance/emporium-types').config} */
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
	.option('-r --root <root>', 'Path to root directory.')
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

			console.info(
				pc.blue(
					`* Using config at index ${basename(pc.gray(configPath))}`
				)
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
				.then(async ({ lines }) => {
					if (!lines) return undefined

					console.info(
						pc.green(
							`✔︎ Generated Solidity code based on EIP-712 types to:\n\t${pc.gray(
								`${config.out}${config.contract.name}.sol`
							)}`
						)
					)

					const cwd = process.cwd()
					const outPath = resolve(
						cwd,
						config.out,
						`${config.contract.name}.sol`
					)

					await ensureDir(dirname(outPath))
					await fse.writeFile(outPath, lines)
				})
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

program
	.command('docs')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
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

			console.info(
				pc.blue(
					`* Using config at index ${basename(pc.gray(configPath))}`
				)
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
				.then(async ({ documentation }) => {
					if (!documentation) return

					for await (const element of documentation) {
						const cwd = process.cwd()

						const restOfPath = element.path.split('/')
						const fileName = restOfPath.pop()
						const folderPath = restOfPath.join('/')

						const outPath = resolve(
							cwd,
							`${config.outDocs}${folderPath}`,
							`${fileName}`
						)

						await ensureDir(dirname(outPath))
						await fse.writeFile(outPath, element.markdown)
					}

					console.info(
						pc.green(
							`✔︎ Generated documentation based on contracts at:\n\t${pc.gray(
								`${config.outDocs}`
							)}`
						)
					)
				})
				.catch(error => {
					console.error(
						pc.red(
							'✘ Failed to generate documentation based on EIP-712 types.'
						)
					)

					console.error(pc.red(error))
				})
		}
	})

program
	.command('zod')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
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

			console.info(
				pc.blue(
					`* Using config at index ${basename(pc.gray(configPath))}`
				)
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

			const schemas: string[] = []

			// * Always include the domain type as it will be needed to build domain-localized signatures.
			const types = {
				...config.types,
				...EIP712_TYPES
			}

			const typesUsed = new Set<string>()

			for await (const element of Object.keys(types)) {
				const fields = types[element as keyof typeof types]

				if (!fields) continue

				schemas.push(`export const ${element}Schema = z.object({${fields
					.map(field => {
						const typeUsed =
							field.name === 'chainId'
								? 'z.number()'
								: getTypeSchema(field.type)

						if (
							typeUsed.startsWith('z.') === false &&
							typeUsed.endsWith('Schema') == false
						)
							typesUsed.add(typeUsed)

						return `\n\t${field.name}: ${typeUsed}`
					})
					.join(',')}\n})

                    export type ${element} = z.infer<typeof ${element}Schema>`)
			}

			const cwd = process.cwd()

			const outPath = resolve(cwd, './src/zod', 'index.ts')

			await ensureDir(dirname(outPath))

			const formatted = await format(
				[
					"import { z } from 'zod'",
					`import { ${Array.from(typesUsed.values()).join(
						','
					)} } from './types'`,
					`\n${schemas.join('\n\n')}`
				].join('\n')
			)

			await fse.writeFile(outPath, formatted)
		}

		console.info(
			pc.green(
				`✔︎ Generated Zod types on contracts at:\n\t${pc.gray(
					`${'./src/zod/index.ts'}`
				)}`
			)
		)
	})

program.parse()
