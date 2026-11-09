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
    // 开启lib模式，但不使用下面配置
    lib: {
      entry: '',
      formats: ['es', 'cjs'],
    },
  },
  plugins: [cssjs()],
};

export default config;
