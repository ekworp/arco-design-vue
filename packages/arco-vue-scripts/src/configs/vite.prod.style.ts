import { InlineConfig, Plugin } from 'vite';
import cssjs from '../plugins/vite-plugin-cssjs/index.js';

const preserveStyleImports: Plugin = {
  name: 'preserve-style-imports',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/style/index.ts')) {
      return;
    }

    return code.replace(
      /(import\s+)(['"])([^'"]+\/style)\2/g,
      '$1$2$3/index.less$2',
    );
  },
};

const config: InlineConfig = {
  mode: 'production',
  build: {
    target: 'es2020',
    outDir: 'es',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: /less$/,
      output: [
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].js',
        },
        {
          format: 'commonjs',
          dir: 'lib',
          entryFileNames: '[name].js',
        },
      ],
    },
  },
  plugins: [preserveStyleImports, cssjs()],
};

export default config;
