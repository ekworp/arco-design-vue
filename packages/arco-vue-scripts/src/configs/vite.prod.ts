import { InlineConfig } from 'vite';
import { globSync } from 'glob';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import external from '../plugins/vite-plugin-external/index.js';
import vueExportHelper from '../plugins/vite-plugin-vue-export-helper/index.js';

const langFiles = globSync('components/locale/lang/*.ts');

const config: InlineConfig = {
  mode: 'production',
  build: {
    target: 'es2020',
    outDir: 'es',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: ['components/index.ts', 'components/icon/index.ts', ...langFiles],
      output: [
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'components',
        },
        {
          format: 'commonjs',
          dir: 'lib',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'components',
        },
      ],
    },
    // 开启lib模式，但不使用下面配置
    lib: {
      entry: 'components/index.ts',
      formats: ['es', 'cjs'],
    },
  },
  // @ts-ignore vite内部类型错误
  plugins: [external(), vue(), vueJsx(), vueExportHelper()],
};

export default config;
