import { Config } from 'svgo';

const options: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    'removeStyleElement',
    'removeScripts',
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'class',
          'style',
          'stroke-width',
          'stroke-linecap',
          'stroke-linejoin',
        ],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      // @ts-ignore
      params: {
        attributes: [
          { ':class': 'cls' },
          { ':style': 'innerStyle' },
          { ':stroke-width': 'strokeWidth' },
          { ':stroke-linecap': 'strokeLinecap' },
          { ':stroke-linejoin': 'strokeLinejoin' },
          { '@click': 'onClick' },
        ],
      },
    },
  ] as any,
};

export default options;
