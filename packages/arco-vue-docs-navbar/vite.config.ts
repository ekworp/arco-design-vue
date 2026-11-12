import path from 'node:path';
import { defineConfig } from 'vite';
import svgr from './plugins/rollup-plugin-svgr';

export default defineConfig({
  mode: 'development',
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'normalize-global-css',
          Once(root: { walkRules: (callback: (rule: { selector: string }) => void) => void }) {
            root.walkRules((rule) => {
              rule.selector = rule.selector.replaceAll(
                /:global\(([^)]+)\)/g,
                '$1',
              );
            });
          },
        },
      ],
    },
    preprocessorOptions: {
      less: {
        modifyVars: {
          prefix: 'arco-react',
        },
      },
    },
  },
  build: {
    target: 'es2020',
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
  plugins: [
    {
      name: 'docsearch-compat',
      enforce: 'pre',
      resolveId(id) {
        if (id === '@docsearch/react/dist/esm/AlgoliaLogo') {
          return '\0docsearch-algolia-logo';
        }
        if (id === '@docsearch/react/dist/esm/useSearchClient') {
          return '\0docsearch-use-search-client';
        }
      },
      load(id) {
        const modulePath = path
          .resolve(
            'node_modules/@docsearch/react/dist/esm/useSearchClient-Dfh7Oq9Z.js',
          )
          .replaceAll('\\', '/');
        if (id === '\0docsearch-algolia-logo') {
          return `export { a as AlgoliaLogo } from '${modulePath}';`;
        }
        if (id === '\0docsearch-use-search-client') {
          return `export { t as useSearchClient } from '${modulePath}';`;
        }
      },
    },
    svgr(),
  ],
});
