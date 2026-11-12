import path from 'path';
import { defineConfig, InlineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDocsModule from '@arco-design/vite-plugin-arco-vue-docs';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import svgLoader from 'vite-svg-loader';
import paths from '../utils/paths.js';

const root = process.cwd();
const vueDocs = (vueDocsModule as any).default;

const ArcoVueResolver = () => {
  const resolver: any = ArcoResolver({
    importStyle: false,
    resolveIcons: false,
  });

  return {
    type: 'component' as const,
    resolve(name: string) {
      const result = resolver.resolve(name) as any;
      if (!result) return;

      return {
        ...result,
        from: result.from.replace(
          '@arco-design/web-vue',
          '@ekworp/arco-design-vue'
        ),
      };
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.AssetsPublicPath || '/arco-design-vue/';

  return {
    mode: 'production',
    base,
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
    build: {
      target: 'es2015',
    },
    plugins: [
      vueDocs(),
      Components({
        dts: false,
        include: [/arco-vue-docs/],
        resolvers: [ArcoVueResolver()],
      }),
      vue(),
      vueJsx(),
      svgLoader({ svgoConfig: {} }),
    ],
  } as InlineConfig;
});
