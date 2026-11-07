import fs from 'fs';
import type { Plugin } from 'vite';
import { transform as transformSvg } from '@svgr/core';
import esbuild from 'esbuild';

export default function svgrPlugin(): Plugin {
  // TODO: options
  return {
    name: 'vite:svgr',
    // eslint-disable-next-line consistent-return
    async transform(code, id) {
      if (id.endsWith('.svg')) {
        const svg = await fs.promises.readFile(id, 'utf8');

        const componentCode = await transformSvg(
          svg,
          {
            exportType: 'default',
            plugins: ['@svgr/plugin-jsx'],
          },
          { filePath: id },
        );

        const res = await esbuild.transform(componentCode, {
          loader: 'jsx',
        });

        return {
          code: res.code,
        };
      }
    },
  };
}
