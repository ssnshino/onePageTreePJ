# HERO TREE PROTOTYPE 02 — OLD OAK WORKLOG

Updated: 2026-09-24T13:32:00+09:00

## Branch / PR

- Branch: `feature/v0.6-hero-tree-prototype-02-old-oak`
- Stacked base: `refactor/source-split-build-system`
- Draft PR: `#5`

## Research First

Implementation was preceded by direct review of:

- Weber & Penn (SIGGRAPH 1995)
- Three.js r186 `TreeGenerator.js`
- SeedThree `src/species/white-oak.js`
- SeedThree `src/core/weber-penn.js`
- SeedThree `src/core/leaf-cards.js`
- SeedThree branch-card / impostor direction

## Morphology Changes

Prototype 01 generic recursive tree was replaced by an OLD OAK morphology preset.

Key values/direction:
- trunk height approximately 12.5 world units
- heavy base flare
- spherical crown length profile
- low scaffold limbs near 68 degree down-angle from trunk axis
- golden-angle sibling distribution
- pipe-model branch radius
- S-curve style primary scaffold bending
- high secondary/twig gnarl
- branch tip phototropic up-pull
- terrain-following exposed roots

## Foliage Changes

Prototype 01 generic foliage-cluster cards were removed.

Prototype 02:
- procedural lobed white-oak-style single leaf
- transparent-edge RGB kept green to reduce mip halo
- leaves attach to terminal twig centreline
- leaf card base is the attachment point
- leaves roll around twig by golden-angle sequence
- orientation is built from the local twig frame
- all leaves use one `InstancedMesh`

Desktop target:
- 9 leaves per terminal twig

Mobile target:
- 5 leaves per terminal twig

## Performance HUD

Added:
- FPS
- triangles
- draw calls
- geometry count
- texture count
- DPR
- reflection resolution

## Build

Static concatenated application parse before commit:
**PASS**

GitHub Actions:
- run id: `35955885981`
- conclusion: **SUCCESS**
- build: PASS
- artifact upload: PASS
- verify: PASS

Artifact:
`threejs_onepage_waterworld_v0.6_hero_tree_prototype_02_old_oak.html`

Generated HTML:
approximately 601 KiB on disk.

## Human Gate

Visual quality is intentionally not self-certified by automatic QA.

Next Human review should inspect:
- mature oak silhouette
- primary limb weight
- crown width
- leaf density
- card visibility
- root/terrain connection
- FPS / TRI / CALL metrics
- reflection regression
