import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['examples/**', 'dist/**'],
      thresholds: {
        lines: 80,
        functions: 60,
        branches: 80,
        statements: 80,
      },
    },
  },
});
