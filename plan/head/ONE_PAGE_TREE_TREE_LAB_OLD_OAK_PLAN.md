# OLD OAK TREE LAB PLAN

Created: 2026-09-24T13:53:00+09:00

## Purpose
Tune the Hero Tree without lake/world context hiding problems.

## Uses the same source
TREE LAB directly bundles:
- `55-old-oak-spec.js`
- `56-old-oak-skeleton.js`
- `57-old-oak-foliage.js`

No separate fake tree implementation.

## Controls
- seed
- height
- trunk radius
- root flare
- junction collar
- primary branch count
- primary angle
- L1/L2 gnarl
- tip up-pull
- leaves per twig
- leaf size

## Review modes
- 3/4
- front
- side
- top
- silhouette
- wireframe
- leaves on/off
- roots on/off
- random seed

## Stats
- stem count
- terminal twig count
- leaf count
- tree triangles
- build milliseconds
- FPS
- total triangles
- draw calls
- geometry / texture counts
- DPR

## First tuning experiments
1. branch collar strength
2. primary branch count/angle
3. secondary gnarl
4. foliage density
5. leaf size

## Later
- real continuous junction mesh
- parent/child normal blending
- canopy/dome normals
- GPU wind
- branch-card/impostor LOD
