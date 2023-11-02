import { defineConfig } from 'tsup'

import { dependencies } from './package.json'
import { getConfig } from './src/lib/functions/tsup'

export default defineConfig(
	getConfig({
		entry: [
			'src/index.ts',
			'src/core/cli.ts',
			'src/zod/index.ts',
			'src/zod/types.ts'
		],
		external: [...Object.keys(dependencies)]
	})
)
