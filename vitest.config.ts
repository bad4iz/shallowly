import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {},
  },
  test: {
    clearMocks: true,
    coverage: {
      exclude: [],
      include: ['src/**/*.[tj]s?(x)'],
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'cobertura', 'lcov'],
      reportsDirectory: 'coverage_vitest',

      thresholds: {
        // Coverage thresholds for all files
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/**/?(*.)+(spec|test).[tj]s?(x)', 'tests/**/?(*.)+(spec|test).[tj]s?(x)'],
    restoreMocks: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
