# ONE-PAGE BUILD ARCHITECTURE SPEC

Created: 2026-09-24T12:32:00+09:00

## Principle
**One-page is the distribution format, not the source-code format.**

## Development Flow

```text
src/index.template.html
src/styles.css
src/js/*.js
        |
        v
scripts/build-onepage.mjs
        |
        +-- ordered fragment concatenation
        +-- Three.js r186 imports
        +-- esbuild IIFE bundle
        +-- inline CSS / JS
        v
dist/threejs_onepage_waterworld_v0.6_hero_tree_prototype_01.html
```

## Runtime Contract
生成HTMLは import map / `type="module"` / runtime Three.js CDN を必要としない。
Three.jsとaddonsはinline IIFEへbundleする。

## Fragment Contract
`src/js/manifest.json` が実行順の正本。
現段階ではfragment同士は連結後に同一lexical scopeを共有する。
これは安全な移行用構造であり、後から vegetation / geology / world / rendering / UI を段階的にmodule化する。

## Version Policy
npm dependencyはpinする。
mainはHuman-reviewed stable。
review済みsingle HTML artifactはGitHubから直接取得できる形で保存可能とする。
