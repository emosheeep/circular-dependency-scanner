import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['esm'],
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/cli.ts', 'src/worker.ts'],
  shims: true,
  copy: {
    from: 'wasm/*.wasm',
    to: 'dist',
  },
});
