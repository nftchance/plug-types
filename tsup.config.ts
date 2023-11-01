import { defineConfig } from 'tsup'

export default defineConfig({
	entryPoints: ['src/index.ts', 'src/zod.ts', 'src/core/cli.ts'],
	outDir: 'dist',
	dts: true,
	sourcemap: true,
	clean: true,
	format: ['cjs', 'esm'],
	minify: true,
	splitting: false
})
