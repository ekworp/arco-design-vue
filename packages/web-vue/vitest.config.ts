import path from 'node:path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDocs from '@arco-design/vite-plugin-arco-vue-docs';

export default defineConfig({
  plugins: [vueDocs(), vue(), vueJsx()],
  resolve: {
    alias: {
      '@arco-design/web-vue': path.resolve(__dirname),
      '@arco-design/web-vue/es/icon': path.resolve(
        __dirname,
        'components/icon',
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./scripts/setup.ts'],
    testTimeout: 20000,
    hookTimeout: 20000,
    include: ['components/**/__test__/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '.coverage',
      include: ['components/**/*.{vue,tsx,ts}'],
      exclude: ['components/icon/**/*', '**/style/*'],
    },
  },
});
