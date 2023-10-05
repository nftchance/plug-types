import { bundleRequire } from 'bundle-require'
import { findUp } from 'find-up'
import { default as fse } from 'fs-extra'
import { resolve } from 'pathe'

const name = 'emporium'

const configFiles = [
	`${name}.config.ts`,
	`${name}.config.js`,
	`${name}.config.mjs`,
	`${name}.config.mts`
]

export async function find({
	config,
	root
}: Partial<{ config: string; root: string }> | undefined = {}) {
	const rootDir = resolve(root || process.cwd())

	// ! We already know where the config is.
	if (config) {
		const path = resolve(rootDir, config)

		if (fse.pathExistsSync(path)) return path

		return
	}

	// * We don't know where the config is, so we need to find it.
	return await findUp(configFiles, { cwd: rootDir })
}

export async function load({ configPath }: { configPath: string }) {
	const res = await bundleRequire({
		filepath: configPath
	})

	let config = res.mod.default

	if (config.default) config = config.default

	if (typeof config !== 'function') return config

	return await config()
}
