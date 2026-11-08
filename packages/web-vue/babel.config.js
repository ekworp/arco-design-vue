module.exports = {
  presets: [
    ['@babel/preset-env'],
    [
      '@babel/preset-typescript',
      {
        ignoreExtensions: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-class-properties',
    '@vue/babel-plugin-jsx',
  ],
};
