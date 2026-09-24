# src/

開発用正本。

完成物の「一枚HTML」と、開発時のソース構成を分離する。

## Current transitional structure

`src/js/*.js` は実行順を保持した ordered fragments。

build時に `manifest.json` 順で同一scopeへ連結し、その後 esbuild が Three.js r186 と addons を IIFE bundleする。

この方式を採る理由:
- v0.6の挙動・RNG・共有変数順を一度に壊さない
- Git diffを機能単位で読める
- Hero Tree / Rocks / Water等を別ファイルで育てられる
- 後から安全に本物のES modulesへ段階移行できる
- 配布物は引き続き一枚HTML

## Build

```bash
npm install
npm run build
npm run verify
```

Output:
`dist/threejs_onepage_waterworld_v0.6_hero_tree_prototype_01.html`
