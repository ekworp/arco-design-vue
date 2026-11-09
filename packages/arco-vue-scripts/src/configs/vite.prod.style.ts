import { InlineConfig } from 'vite';
import cssjs from '../plugins/vite-plugin-cssjs/index.js';

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
  plugins: [cssjs()],
};

export default config;
