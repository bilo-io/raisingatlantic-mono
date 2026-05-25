import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      // Initial baseline: only collect coverage from areas that currently have tests
      // (lib/api). Expand the include list as new component / hook tests land so
      // the numbers reflect real coverage of tested code, not 0% of every component.
      include: ['src/lib/api/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@raising-atlantic/ui': path.resolve(__dirname, '../../pkgs/ui/src/index.ts'),
    },
  },
});
