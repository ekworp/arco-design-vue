import path from 'path';
import { defineConfig, InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDocsModule from '@arco-design/vite-plugin-arco-vue-docs';
import svgLoader from 'vite-svg-loader';
import paths from '../utils/paths.js';

const root = process.cwd();
const vueDocs = (vueDocsModule as any).default;

export default defineConfig({
  mode: 'development',
  server: {
    open: true,
    host: '0.0.0.0',
    port: 2233,
    fs: {
      strict: true,
      allow: ['..'],
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        paths: [paths.resolvePath('../web-vue')],
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^@web-vue\/(.*)/,
        replacement: path.resolve(root, '../web-vue/$1'),
      },
    ],
  },
  plugins: [vueDocs(), vue(), vueJsx(), svgLoader({ svgoConfig: {} })],
}) as InlineConfig;
