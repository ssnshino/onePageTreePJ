# OLD OAK TREE LAB — WORKLOG

Updated: 2026-09-24T14:01:00+09:00

## Branch / PR
- Branch: `feature/tree-lab-old-oak-tuning`
- Base: `feature/v0.6-hero-tree-prototype-02-old-oak`
- Draft PR: `#6`

## Purpose
Isolate the exact OLD OAK generator from the lake scene and tune the tree without atmospheric context hiding defects.

## External research applied

### Branch junctions
Reviewed branch-junction and production tree-meshing approaches.

Key finding:
raw intersecting tubes are a known quality limit. Better approaches use child-base fitting, intersection smoothing, normal/UV blending, or a continuous mesh.

Prototype experiment:
- added `junctionCollarScale`
- added `junctionCollarLength`
- child branches receive a short base bulge before normal taper

This is deliberately a low-cost intermediate step before continuous branch-junction meshing.

### Foliage card overdraw
Alpha-tested leaves remain standard, but the mesh should fit the leaf silhouette more closely than a large transparent rectangle.

Prototype experiment:
- OLD OAK leaf mesh changed from constant-width strip to silhouette-trimmed rows
- alpha texture remains for lobed edge detail
- same InstancedMesh path retained

## TREE LAB

The lab directly bundles the production/shared files:
- `55-old-oak-spec.js`
- `56-old-oak-skeleton.js`
- `57-old-oak-foliage.js`

There is no separate fake tree generator.

Tunable:
- seed
- height
- trunk radius
- root flare
- junction collar
- primary branch count
- primary branch angle
- L1/L2 gnarl
- tip up-pull
- leaves per twig
- leaf size

Review modes:
- 3/4
- front
- side
- top
- silhouette
- wireframe
- leaves on/off
- roots on/off

Metrics:
- stems
- terminal twigs
- leaves
- tree triangles
- rebuild milliseconds
- FPS
- total triangles
- draw calls
- geometries
- textures
- DPR

## Build / CI

GitHub Actions run:
`35958048878`

Result:
**SUCCESS**

Outputs:
- `dist/threejs_onepage_waterworld_v0.6_hero_tree_prototype_02_old_oak.html`
- `dist/tree-lab-old-oak.html`

TREE LAB size:
approximately **572 KiB**

Both outputs are r186 bundled one-page HTML files for direct local execution.

## Next Human work
Use TREE LAB to find a visually convincing range for:
1. trunk radius / flare
2. junction collar
3. primary count / angle
4. gnarl
5. leaf count / size

Then promote chosen values back into the canonical OLD OAK preset.
