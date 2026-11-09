# Changelog

本项目基于 [Arco Design Vue](https://github.com/arco-design/arco-design-vue)，用于维护个人发布版本。

## 2.59.0 - 2026-11-09

### Changed

- 升级 Vite 至 8，使用 Rolldown 构建。
- 升级 Storybook 至 10。
- 升级 TypeScript 至 7。
- 升级 Vue I18n 至 11.4.18。
- 升级 Vue Router 至 5.4.0。
- 升级 `compute-scroll-into-view` 至 3.1.1。
- 升级 `scroll-into-view-if-needed` 至 3.1.0。
- 升级 `jsdom` 至 27.4.0。
- 升级 `vite-svg-loader` 至 5.1.3。
- 升级 Stylelint、Commitlint 及 CLI 工具链依赖。
- 升级 Node.js 类型定义及 Terser Rollup 插件。

### Fixed

- 适配 `compute-scroll-into-view` 3.x，改用命名导入 `compute`。
- 修正 Vite 文档插件中 Vite 及 Vue 插件的依赖归类。
- 移除与 Stylelint 18 不兼容的旧配置依赖。

### Validation

- 通过 web-vue 组件构建。
- 通过文档站构建。
- 通过 Anchor、Form 单元测试及 TypeScript 检查。
- 通过 npm 包打包预览检查。

### Known issues

- 部分 Demo 快照测试受 Vite 8 下 Markdown 动态导入兼容问题影响。
- `@arco-materials/site-navbar-new` 和 `@arco-materials/site-utils` 的最新版本仍声明过时的 React 16 peer 依赖。
