# ONE-PAGE THREE.JS REALISTIC WORLD — BUILD SYSTEM / SOURCE SPLIT PLAN

Created: 2026-09-24T12:32:00+09:00

## Purpose
「一枚ペラ」をソースコード制約ではなく**配布フォーマット**として再定義する。

開発時は複数ファイル・Git差分・research・testを利用し、build成果物だけを一枚HTMLへ畳む。

## Baseline
Stacked on `feature/v0.6-hero-tree-prototype-01`。
source extractionは r186 module candidate commit `74564e8988b0779dd86b68fed5cfa3c634ce6fb2`。

## Build Strategy
- Three.js `0.186.0`
- esbuild `0.28.2`
- IIFE bundle
- CSS / JS inline
- import mapなし
- runtime CDN JavaScriptなし
- final outputはsingle HTML
- direct `file://` execution target

## Source Split — Phase 1
挙動順を変えず ordered fragments へ分割する。

- 00 bootstrap
- 10 renderer / scene
- 20 environment / sun
- 30 terrain
- 40 natural common / procedural materials
- 50 rocks
- 60 hero tree
- 70 reeds
- 80 props / water
- 90 controls / animation loop

Fragmentsはbuild時に同一scopeへ連結してからbundleする。

## Non-target
- visual redesign
- Hero Tree Prototype 02
- forest LOD
- rock rewrite
- full module rewrite

## Regression
Water / reflection / lakebed / Sky / PMREM / ACES / mountain / fog / rocks / reeds / props / OrbitControls / smartphone local executionを維持。

## QA
1. fragment再連結が元app sourceと一致
2. esbuild成功
3. distは一枚HTML
4. module/importmap/runtime Three.js CDNなし
5. bundle syntax PASS
6. GitHub Actions PASS
7. smartphone `file://` 起動
8. Human visual comparison

## Success
開発は複数sourceで行い、配布は一枚HTMLのまま維持できる。
