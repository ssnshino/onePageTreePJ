# HERO TREE PROTOTYPE 01 — RESEARCH NOTE

Updated: 2026-09-24T10:06:00+09:00

## Goal

v0.6 NATURAL ASSET QUALITY の第一段階として、まず一本の老いた広葉樹を近景品質へ引き上げる。

## Three.js r186 TreeGenerator

Three.js r186 の `TreeGenerator` は、trunk / branch / twig を tapered swept tube として再帰生成し、parallel-transport frame、pipe-model taper、golden-angle roll、root flare、gravity droop 等を使う。

重要なのは、TreeGenerator自体も「branch skeletonを生成し、foliageは別layer」としていること。

Reference:
- https://threejs.org/docs/pages/TreeGenerator.html

### 採用

- deterministic seed
- curved swept branch
- taper
- recursive hierarchy
- golden-angle-like branch distribution
- root / buttress
- foliage separation

### 今回採用しない

TreeGenerator moduleそのものの直接importは行わない。
既存v0.5はWebGL + MeshStandardMaterial系であり、一枚HTMLの依存を増やさず構造原則だけを軽量実装する。

## Foliage cards

Solid crown geometryは廃止する。

Reference:
- https://threejs.org/docs/pages/Material.html
- https://threejs.org/docs/pages/MeshStandardMaterial.html

採用:
- procedural Canvas color texture
- separate grayscale alphaMap
- `alphaTest`
- `DoubleSide`
- desktopのみ `alphaToCoverage`
- `depthWrite:true`

alpha blendingではなくcutoutを優先し、sorting負荷を避ける。

## Instancing

Reference:
- https://threejs.org/docs/pages/InstancedMesh.html

同一leaf-card geometry/materialを `InstancedMesh` 化する。
Hero Tree 1本でもこの構造を採用し、後のforest / LODへ転用可能にする。

## Visual Principle

成功条件は技術名ではない。

- 幹が電柱に見えない
- 枝が配管に見えない
- 樹冠が球に見えない
- 葉の間から空が抜ける
- 根元が地面へ刺さった棒に見えない

この5点をHuman visual reviewで判定する。

## Local-file runtime research

Human smartphone QA found that the original r186 module candidate did not run when downloaded and opened locally.

MDN documents that JavaScript modules opened through `file://` run into CORS/security restrictions and should normally be tested through HTTP(S).

Three.js removed the classic `build/three.js` / `build/three.min.js` distribution after r160 (r161+ is ES-module oriented).

For Prototype 01, the compatibility experiment therefore uses Three.js r160 classic core and adapts the required r160 addons into the same HTML. This is a runtime portability experiment, not a visual-quality downgrade target.

References:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://github.com/mrdoob/three.js/wiki/Migration-Guide
