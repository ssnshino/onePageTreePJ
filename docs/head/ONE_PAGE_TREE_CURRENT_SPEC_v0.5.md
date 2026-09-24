# ONE-PAGE THREE.JS REALISTIC WORLD — Current Specification

Created: 2026-09-24T09:39:00+09:00
Baseline: `v0.5 TREES & ROCKS`

## Purpose
Three.js / WebGLを用い、一枚HTMLで実写に近いヴァーチャル自然空間を構築する。

## Runtime
- Browser
- Three.js r186 via CDN module/import map
- OrbitControls
- Water
- Sky
- PMREM
- ACES Filmic tone mapping

## Current Scene
- lake
- shallow water / lakebed
- planar reflection
- sky / sun
- fog
- mountain terrain
- pier / buoy
- shoreline vegetation
- procedural trees
- procedural rocks

## Version Evolution
### v0.1
Basic Three.js space and shader water.
### v0.2
Real planar reflection, Sky, PMREM, PBR terrain.
### v0.3
Clear water, lakebed, shallow region, underwater objects.
### v0.4
Lakeshore, reeds, shore stones, mixed simple trees.
### v0.5
Tree branch structures, improved crowns, procedural fractured rock direction, bark/stone procedural detail.

## Current Evaluation
- Water: passable
- Mountains: passable
- Trees: priority improvement target
- Rocks: priority improvement target

## Design Principle
The lowest-quality visible element sets the quality ceiling of the entire scene.

## Performance
Use desktop/mobile quality differences and avoid brute-force detail.
Preferred tools include instancing, merged geometry, LOD and resolution switching.
