import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      cli: 'src/cli.ts',
      index: 'src/index.ts',
      worker: 'src/worker.ts',
    },
  },
  output: {
    distPath: {
      wasm: '.'
    }
  },
  lib: [
    {
      format: 'esm',
      dts: { distPath: 'dist/types' },
      shims: {
        esm: {
          __filename: true,
        },
      },
    },
  ],
});
