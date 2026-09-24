# ONE-PAGE THREE.JS REALISTIC WORLD — HERO TREE PROTOTYPE 01 SPEC

Created: 2026-09-24T10:06:00+09:00
Candidate: `threejs_onepage_waterworld_v0.6_hero_tree_prototype_01.html`

## Status

v0.6 candidate / Human visual review pending. Local-file-safe runtime revision applied after first smartphone QA.
Current stable baseline remains v0.5.

## Purpose

森を量産する前に、一木だけをhero assetとして作り、近景で木として成立する最低品質を決める。

## Wood Geometry

### Sweep

`buildSweptBranch(points, r0, r1, radialSegments, seed)`

- CatmullRomCurve3
- tapered rings
- parallel-transport-like frame update
- indexed BufferGeometry
- generated UV
- computed vertex normals

### Hierarchy

`buildHeroTreePrototype(seed)`

4 level:
1. trunk
2. major branch
3. secondary branch
4. twig

Branch rollはgolden-angle-like sequence + deterministic jitter。

### Root

8本のsurface root / buttressを生成。
root endは一部地表へ沈め、pole-in-ground silhouetteを避ける。

## Bark

v0.5 procedural bark texture / bump materialを継続利用。
Water / Sky / terrainとは独立。

## Foliage

`makeLeafClusterTextures()`

- Canvas color map
- Canvas alpha map
- leaf cluster = 12 leaf silhouettes + twig
- mapはSRGB
- alphaMapはnon-color
- alphaTest = 0.45
- DoubleSide
- desktop alphaToCoverage
- InstancedMesh

Foliage placementはbranch-tip anchor由来。
球状crown meshは使用しない。

## Placement

Hero tree:
- X = -24
- Z = -50
- Y = terrainHeight(X,Z)
- test calculation Y ≈ +0.19
- water surface Y = +0.03

湖岸ぎりぎりへ配置し、root / shoreline / reflectionの統合を確認する。

## Camera

Prototype initial cameraはhero treeを主対象へ向ける。
OrbitControlsは維持し、近接確認可能。

## Mobile

- hero branch geometry自体は共通
- leaf cluster texture resolution: desktop 256 / mobile 192
- foliage cards: desktop 2 per anchor / mobile 1 per anchor
- renderer DPR / reflection resolutionは既存mobile fallbackを維持

## Deferred

- forest placement
- near/mid/far LOD
- billboard
- wind shader
- branch wind
- rock rewrite
- fantasy world-tree embellishment

## Regression Boundary

変更しない:
- planar reflection
- clear lake / lakebed
- Sky / PMREM
- ACES Filmic tone mapping
- mountains
- fog
- v0.5 rock pass
- pier / buoy
- reeds
- water controls

## Runtime Packaging

Prototype 01 candidate is self-contained for local browser execution.

- HTML script mode: classic script
- Three.js core: r160 classic UMD, inlined
- OrbitControls / Water / Sky / BufferGeometryUtils: r160 source adapted from ESM to global `THREE` and inlined
- external JavaScript requests: none
- import map: none
- ES module script: none
- expected origin: `file://` or HTTP(S)

Candidate size is approximately 0.8 MB because the engine and required addons are embedded.

The stable project baseline remains Three.js r186 until Human Review decides the long-term packaging strategy.
