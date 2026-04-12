import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  target: 'es2020',
  splitting: false,
  sourcemap: true,
  minify: false,
  treeshake: true,
})
