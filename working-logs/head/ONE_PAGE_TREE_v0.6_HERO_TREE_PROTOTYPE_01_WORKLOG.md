# HERO TREE PROTOTYPE 01 — WORKLOG

Updated: 2026-09-24T10:06:00+09:00

## Branch

`feature/v0.6-hero-tree-prototype-01`

## Work Performed

1. README / AGENTS / snapshot / v0.6 PLAN / v0.5 SPEC / trees-rocks researchを確認。
2. v0.5 tree implementationを分解。
3. Three.js official docsでTreeGenerator / Material alphaTest / InstancedMeshを再確認。
4. Hero Tree専用PLANを作成。
5. v0.5の量産forest blockをHero Tree 1本へ置換。
6. branch skeletonをcustom tapered swept geometryへ変更。
7. root buttressを追加。
8. solid crown geometryを撤去。
9. procedural foliage card + alphaMap + alphaTestへ変更。
10. initial cameraをHero Tree review向けへ調整。

## Important Finding — v0.5 Repository Artifact

rootおよびsamples/v0.5のHTML blob `140043...` は 41KB / 1000 lines で、`setPreset()` 内の `sunEl.value='14';` で物理的に終端している。

このPhaseではv0.5 artifactそのものは変更しない。

v0.6 Hero Tree candidate生成時のみ、完全なv0.4保存版で同一だったcontrol / resize / animation / catch / closing HTML tailを継ぎ、実行可能な候補HTMLへ復元した。

## Static Verification

GitHub上のcandidate HTMLを再取得し、module scriptからimport文のみ除外してV8 `new Function()` でcompile check。

Result:
- complete `</html>`: PASS
- hero tree symbol: PASS
- legacy `treePrototypes`: absent
- alphaTest foliage: PASS
- animation loop present: PASS
- JavaScript syntax compile: PASS

## Runtime Verification

Agent execution environmentからGitHubへ直接clone/downloadする外向きnetwork routeは利用できず、headless browser runtime testは未実施。

Human browser / smartphone reviewを最終gateとする。

## Next Human Check

- 起動エラーがないか
- 木が初期画面で見えるか
- 幹と大枝のシルエット
- 枝分岐の人工感
- 葉カードの板感
- 樹冠の空の抜け
- 根元と地面の接続
- planar reflectionへの自然な映り込み
- mobile FPS

## Smartphone Local-file Failure

Human QA:
- downloaded Prototype 01 HTML
- opened on smartphone browser
- result: did not run

Diagnosis:
- initial candidate used `<script type="module">`
- Three.js and addons were loaded by import map from CDN
- `file://` + JavaScript module loading is constrained by browser CORS/local-file security

Action:
1. kept the Hero Tree geometry/material work unchanged
2. replaced runtime packaging only
3. inlined Three.js r160 classic core
4. adapted and inlined OrbitControls / Water / Sky / BufferGeometryUtils r160
5. removed import map
6. removed module imports
7. removed runtime CDN dependency

Static verification after repack:
- classic bundled JS parse: PASS
- `type="module"`: absent
- import map: absent
- remote Three.js URL: absent
- ESM `export` token: absent
- Hero Tree implementation: present
- complete HTML terminator: PASS

Next:
- Human smartphone local-file re-test
