import { transformChangelog, transformDemo, transformMain } from './markdown';
import { getDescriptor } from './descriptor';
import {
  getFrontMatter,
  getVueId,
  isDemoMarkdown,
  isVirtualModule,
  normalizeVirtualModuleId,
} from './utils';
import marked from './marked';

function callHook(plugin: any, hook: string, context: any, ...args: any[]) {
  const handler = plugin?.[hook];
  if (typeof handler === 'function') {
    return handler.call(context, ...args);
  }
  return handler?.handler?.call(context, ...args);
}

export default function vueMdPlugin(): any {
  let vuePlugin: any;

  return {
    name: 'vite:arco-vue-docs',
    enforce: 'pre',
    configResolved(resolvedConfig: any) {
      // 获取vue插件，在hotUpload中使用
      vuePlugin = resolvedConfig.plugins.find(
        (p: any) => p.name === 'vite:vue',
      );
    },
    resolveId(id: string) {
      // 遇到虚拟md模块，直接返回id
      if (isVirtualModule(id)) {
        return `\0${normalizeVirtualModuleId(id)}`;
      }
      return null;
    },
    load(id: string) {
      // 遇到虚拟md模块，直接返回缓存的内容
      if (isVirtualModule(id)) {
        return getDescriptor(normalizeVirtualModuleId(id).split('?')[0]);
      }
      return null;
    },
    transform(code: string, id: string) {
      if (!id.endsWith('.md')) {
        return null;
      }
      if (!vuePlugin) {
        return this.error('Not found plugin [vite:vue]');
      }
      if (isVirtualModule(id)) {
        return callHook(
          vuePlugin,
          'transform',
          this,
          code,
          getVueId(normalizeVirtualModuleId(id).split('?')[0]),
        );
      }

      const tokens = marked.lexer(code);
      const frontMatter = getFrontMatter(tokens);

      if (frontMatter?.changelog) {
        return transformChangelog(tokens);
      }

      const vueCode = isDemoMarkdown(id)
        ? transformDemo(tokens, id, frontMatter)
        : transformMain(tokens, id, frontMatter);

      return callHook(vuePlugin, 'transform', this, vueCode, getVueId(id));
    },

    async handleHotUpdate(ctx: any) {
      if (!ctx.file.endsWith('.md') || !vuePlugin) {
        return undefined;
      }

      const { file, read, timestamp, server, modules } = ctx;
      const { moduleGraph } = server;

      const content = await read();

      const tokens = marked.lexer(content);
      const frontMatter = getFrontMatter(tokens);

      if (frontMatter?.changelog) {
        return modules;
      }

      const updated = [];

      const isDemo = isDemoMarkdown(file);

      const component = isDemo
        ? transformDemo(tokens, file, frontMatter)
        : transformMain(tokens, file, frontMatter);

      if (isDemo) {
        const virtualPath = `arco-vue-docs:${encodeURIComponent(
          file.replace(/\\/g, '/'),
        )}`;

        const mods = moduleGraph.getModulesByFile(virtualPath);
        if (mods) {
          const ret = await callHook(vuePlugin, 'handleHotUpdate', this, {
            file: getVueId(virtualPath),
            timestamp,
            modules: [...mods],
            server,
            read: () => getDescriptor(virtualPath),
          });

          updated.push(...(ret || []));
        }
      }

      // reload the content component
      const ret = await callHook(vuePlugin, 'handleHotUpdate', this, {
        file: getVueId(file),
        timestamp,
        modules,
        server,
        read: () => component,
      });

      return [...updated, ...(ret || [])];
    },
  };
}
