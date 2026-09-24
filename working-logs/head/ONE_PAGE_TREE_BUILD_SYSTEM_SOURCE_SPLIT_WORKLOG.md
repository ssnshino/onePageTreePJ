# ONE-PAGE BUILD SYSTEM / SOURCE SPLIT WORKLOG

Updated: 2026-09-24T12:32:00+09:00

## Purpose

一枚HTMLを「開発ソースの形」ではなく「配布成果物の形」として扱うため、v0.6 Hero Tree Prototype 01 を複数source + build pipelineへ移行した。

## Branch / PR

- Branch: `refactor/source-split-build-system`
- Stacked base: `feature/v0.6-hero-tree-prototype-01`
- Draft PR: #4

## Source Split

r186 module candidate commit `74564e8988b0779dd86b68fed5cfa3c634ce6fb2` のapplication scriptを、実行順を変えず ordered fragmentsへ分割した。

- `00-bootstrap.js`
- `10-renderer-scene.js`
- `20-environment.js`
- `30-terrain.js`
- `40-natural-common.js`
- `50-rocks.js`
- `60-hero-tree.js`
- `70-reeds.js`
- `80-props-water.js`
- `90-controls-loop.js`

分割直後に全fragmentを再連結し、元application sourceと完全一致することを確認した。

## Build System

- Node.js >= 20
- Three.js `0.186.0`
- esbuild `0.28.2`
- output format: browser IIFE
- CSS inline
- JS inline
- runtime import mapなし
- runtime Three.js CDNなし
- direct `file://` target

Commands:

```bash
npm install
npm run build
npm run verify
```

## CI Debug History

Initial bundle generation itself succeeded:

- output: approximately 605.5 KiB
- Three.js: r186

Initial verify failed for two reasons.

### 1. Minified symbol check

`buildHeroTreePrototype` function name is not stable after minification.
QA was changed to check stable UI/runtime markers instead of minified implementation symbol names.

### 2. HTML inline corruption

The first build script used:

```js
template.replace(token, js)
```

JavaScript `String.replace()` interprets replacement-string sequences such as `$&`.
The minified Three.js bundle contains such sequences, so the JS was corrupted while being inserted into HTML.

Fixed with callback replacement:

```js
template.replace(token, () => js)
```

This preserves bundle bytes literally.

## CI Result

GitHub Actions run:
- run id: `35953170260`
- conclusion: **SUCCESS**
- build: PASS
- artifact upload: PASS
- verify: PASS

Generated artifact:
`dist/threejs_onepage_waterworld_v0.6_hero_tree_prototype_01.html`

## Local Agent Browser Attempt

The successful artifact was downloaded and syntax-inspected locally.

Container Chromium could not initialize EGL / SwiftShader WebGL in the current execution environment, so visual WebGL browser QA could not be completed there.

This is an environment limitation, not an application runtime failure.

## Human Gate

Next:
1. download successful r186 bundled artifact
2. open directly on smartphone
3. confirm `file://` boot
4. compare visual output against the already-working r160 local-safe Prototype 01 screenshot
5. only after approval, merge/commit reviewed distribution artifact as needed
