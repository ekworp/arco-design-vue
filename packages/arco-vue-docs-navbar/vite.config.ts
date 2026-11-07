import path from 'node:path';
import { defineConfig } from 'vite';
import svgr from './plugins/rollup-plugin-svgr';

export default defineConfig({
  mode: 'development',
  resolve: {
    alias: {
      '@docsearch/react/dist/esm/AlgoliaLogo': path.resolve(
        'node_modules/@docsearch/react/dist/esm/AlgoliaLogo.js',
      ),
      '@docsearch/react/dist/esm/useSearchClient': path.resolve(
        'node_modules/@docsearch/react/dist/esm/useSearchClient.js',
      ),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          prefix: 'arco-react',
        },
      },
    },
  },
  build: {
    target: 'modules',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'style.css',
      },
    },
  },
  plugins: [svgr()],
});
