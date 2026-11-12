# Agent instructions

## Repository shape

- This is a pnpm workspace under `packages/*`; the published package is `packages/web-vue`, renamed to `@ekworp/arco-design-vue`.
- `packages/arco-vue-scripts` owns the build/codegen commands, `packages/vite-plugin-arco-vue-docs` transforms Markdown docs, and `packages/arco-vue-docs` is the site.
- The docs site resolves the `@web-vue/*` alias to the local `packages/web-vue` source; the docs' runtime component imports use `@ekworp/arco-design-vue`.

## Tooling and setup

- Use Node `>=22.12.0` and pnpm 11; install with `pnpm install --frozen-lockfile`.
- `pnpm run init` builds the workspace tooling, reinstalls dependencies, then runs package code generation. Do not assume generated icon/style files already exist after a fresh checkout.
- The pre-commit hook runs `pnpm -r run lint-staged`; lint-staged applies oxlint/Prettier to code and Stylelint/Prettier to styles.

## Build and verification

- Full package build: `pnpm --filter @ekworp/arco-design-vue build`. It builds components, styles, declarations, and JSON metadata.
- For a clean CI-equivalent package build, build tooling first, then generate icons, then build the package:
  ```sh
  pnpm --filter @arco-design/vite-plugin-arco-vue-docs build
  pnpm --filter @arco-design/arco-vue-scripts build
  pnpm --filter @ekworp/arco-design-vue run icongen
  pnpm --filter @ekworp/arco-design-vue build
  ```
- Docs build: `pnpm --filter @arco-design/arco-vue-docs build`; local docs server is `pnpm --filter @arco-design/arco-vue-docs start` on port 2233.
- Component tests: `pnpm --filter @ekworp/arco-design-vue test`; root shortcut is `pnpm test`.
- The package build must produce non-empty `packages/web-vue/es/index.js`, `es/icon/index.js`, and `lib/index.js`.

## Generated styles and docs

- `icongen` generates icon sources/types; `lessgen` regenerates component Less imports. Do not hand-edit generated files under `packages/web-vue/es` or `lib`.
- Shared component styles are side-effect imports. The style build preserves imports such as `select-view` and `trigger`; when changing style build tooling, verify `packages/web-vue/es/select/style/index.js` and another dependent style entry contain their shared `*.less` imports.
- Markdown API tables must render `a-th`/`a-td` cells; otherwise content runs together and Arco Table styles do not apply.
- Package changelogs live only at `packages/web-vue/CHANGELOG.md` and `packages/web-vue/CHANGELOG.zh-CN.md`. Keep both languages updated; do not recreate a root `CHANGELOG.md`.

## Release

- Bump `packages/web-vue/package.json`, update both package changelogs, commit, and tag `v<version>`; `.github/workflows/npm-publish.yml` runs on `v*` tags.
- The publish workflow uses Node 24/pnpm 11 and `npm stage publish .` from `packages/web-vue`; do not use the package's legacy `release` script, which calls direct `npm publish`.
- Staged npm releases require approval in npm after the GitHub Actions job succeeds. Never publish or move tags unless explicitly requested.
