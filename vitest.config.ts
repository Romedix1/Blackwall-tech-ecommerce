import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/server': path.resolve(__dirname, 'node_modules/next/server.js'),
      'server-only': path.resolve(__dirname, './tests/empty-module.js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    exclude: [...configDefaults.exclude, 'testsE2E/**/*'],
    server: {
      deps: {
        inline: ['next-auth'],
      },
    },
  },
} as UserConfig)
