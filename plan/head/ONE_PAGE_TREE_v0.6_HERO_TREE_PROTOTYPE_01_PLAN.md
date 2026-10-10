# ONE-PAGE THREE.JS REALISTIC WORLD v0.6 — HERO TREE PROTOTYPE 01 PLAN

Created: 2026-09-24T10:06:00+09:00

## Purpose
v0.6 NATURAL ASSET QUALITY の最初の実装として、森全体ではなく「一本の木」を近景観賞に耐える品質へ引き上げる。

Fantasy world の世界樹へ発展できる土台を狙うが、このPhaseでは神話的装飾より先に「現実に存在しそうな老いた広葉樹」として成立させる。

## Source Baseline
- Visual/runtime baseline: `threejs_onepage_waterworld_v0.5_trees_rocks.html`
- Note: repository bootstrap時点のroot/sample v0.5 HTMLは `setPreset()` 途中で物理的に終端している。
- Candidate生成時は、v0.5の変更部分を保持しつつ、共有control/animation tailのみ完全なv0.4保存版から復元する。
- v0.5正本そのものはこのPhaseでは変更しない。

## Research Findings
### Three.js TreeGenerator
Three.js r186 TreeGenerator は、procedural tree skeleton を tapered tube と recursive branching で生成し、foliageを別layerとして扱う。
本Prototypeでは依存モジュールを追加せず、その構造原則だけを一枚HTML内へ軽量実装する。

Reference:
- https://threejs.org/docs/pages/TreeGenerator.html

### Foliage
葉はsolid crown meshではなく alpha-cutout foliage cards とする。
`transparent` blending依存を避け、`alphaTest` を用いてsorting問題を抑える。

Reference:
- https://threejs.org/docs/pages/Material.html
- https://threejs.org/docs/pages/MeshStandardMaterial.html

### Instancing
同一leaf-card geometry/materialは `InstancedMesh` を使用し、将来のforest化へ接続できる構造にする。

Reference:
- https://threejs.org/docs/pages/InstancedMesh.html

## Implementation Target
### Wood skeleton
- curved trunk
- nonlinear taper
- 4-level hierarchy: trunk / major branch / secondary / twig
- golden-angle-like branch roll
- deterministic seed
- exposed root / buttress geometry
- procedural bark PBR material reuse

### Foliage
- procedural Canvas leaf-cluster texture
- separate alpha map
- alphaTest cutout
- DoubleSide
- per-instance scale / orientation / tint
- branch-tip based placement
- crown holes remain visible

## Non-target
- forest mass placement
- full near/mid/far LOD
- billboard
- shader wind
- rock rewrite
- water rewrite
- mountain rewrite

## Regression
Maintain unchanged:
- planar reflection
- transparent water / lakebed
- Sky / PMREM
- ACES Filmic tone mapping
- mountain / fog
- rock pass from v0.5
- OrbitControls
- smartphone quality fallback
- one-page HTML

## QA
- candidate contains complete HTML terminator
- module script parses
- browser boot
- no console runtime error
- tree visible in initial composition
- trunk/branch silhouette review
- foliage alpha edge review
- water reflection regression review
- desktop + smartphone viewport
- FPS / triangles observation
- final Human real-device screenshot/video review

## Success Condition
最初の一瞥で「幹＋球」「緑の塊」ではなく、枝の重さ・分岐・根元・葉の隙間を持つ一本の老木として認識できること。

世界樹化は、この現実木がHuman Reviewを通過した後に行う。

## Local-file Compatibility

Human smartphone QA exposed an execution requirement that the initial r186 ES-module candidate did not satisfy.

Downloaded HTML opened as `file://` cannot reliably load JavaScript ES Modules because module loading is subject to CORS/local-file security restrictions.

Prototype 01 therefore uses a **local-file-safe compatibility bundle**:

- Three.js core: r160 classic UMD, fully inlined into the HTML
- OrbitControls: r160 ESM source adapted to global `THREE`, fully inlined
- Water: r160 adapted and inlined
- Sky: r160 adapted and inlined
- BufferGeometryUtils: r160 adapted and inlined
- no import map
- no `type="module"`
- no runtime CDN dependency
- target execution: downloaded HTML opened directly with `file://`

The long-term target remains a current Three.js bundled build; r160 is used here because it is the last official Three.js release that still shipped the classic build, allowing an immediate one-file local execution experiment without introducing an external build pipeline.
