# HERO TREE PROTOTYPE 01 — QA REPORT

Created: 2026-09-24T10:06:00+09:00

## Candidate

`threejs_onepage_waterworld_v0.6_hero_tree_prototype_01.html`

## Automated / Static

| Check | Result |
|---|---|
| complete HTML terminator | PASS |
| module script exists | PASS |
| JS compile check | PASS |
| Hero Tree generator present | PASS |
| legacy v0.5 forest prototype block removed | PASS |
| alpha-cutout foliage path present | PASS |
| renderer animation loop present | PASS |
| one-page structure | PASS |

## Placement Probe

`terrainHeight(-24,-50) ≈ +0.187`

Water surface:
`+0.03`

The trunk therefore begins just above the wet shoreline.

## Browser Runtime

First Human smartphone local-file test: **FAIL** on the ES-module candidate.

Root cause direction:
`file://` local execution + ES module/import-map runtime.

Runtime packaging was then replaced with a self-contained classic bundle.

Static checks after local-safe repack:
- Three.js r160 classic core inlined: PASS
- OrbitControls inlined: PASS
- Water inlined: PASS
- Sky inlined: PASS
- BufferGeometryUtils inlined: PASS
- import map absent: PASS
- module script absent: PASS
- remote Three.js dependency absent: PASS
- combined JS parse: PASS

Status:
**PENDING HUMAN SMARTPHONE LOCAL-FILE RETEST**

## Visual Acceptance Criteria

1. trunk silhouette does not read as a straight cylinder
2. major branches visibly taper
3. secondary branching is readable
4. crown is not a solid green sphere
5. sky holes exist through foliage
6. roots visually anchor the tree
7. reflection does not regress
8. mobile remains operational

## Packaging Note

Candidate package size: approximately 0.8 MB.

This increase is intentional: the browser engine runtime required by this prototype is embedded in the one-page HTML so the file no longer depends on ES-module loading from `file://`.
