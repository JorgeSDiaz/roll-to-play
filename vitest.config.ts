import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@search': '/src/search',
      '@game-list': '/src/game-list',
      '@shuffle': '/src/shuffle',
      '@api-key': '/src/api-key',
    },
  },
});
