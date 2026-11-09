import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as vueCompiler from 'vue/compiler-sfc';

const configDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal: async (config) => ({
    ...config,
    plugins: [
      vue({ compiler: vueCompiler }),
      vueJsx(),
      ...(config.plugins ?? []),
    ],
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@web-vue': path.resolve(configDir, '../../web-vue'),
      },
    },
    css: {
      ...config.css,
      preprocessorOptions: {
        ...config.css?.preprocessorOptions,
        less: {
          ...config.css?.preprocessorOptions?.less,
          javascriptEnabled: true,
          paths: [path.resolve(configDir, '../../web-vue')],
        },
      },
    },
  }),
};

export default config;
