import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{j,t}s?(x)'],
    exclude: ['prisma'],
    reporters: ['verbose'],
    coverage: {
      reporter: ['cobertura', 'html']
    }
  }
});
