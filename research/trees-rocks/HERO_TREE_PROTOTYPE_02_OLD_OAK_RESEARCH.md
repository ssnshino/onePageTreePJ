# HERO TREE PROTOTYPE 02 — OLD OAK RESEARCH

Created: 2026-09-24T12:32:00+09:00

## Research basis

### Weber & Penn (SIGGRAPH 1995)
- https://doi.org/10.1145/218380.218427
- https://courses.cs.duke.edu/cps124/fall02/resources/p119-weber.pdf

Adopted:
- spherical crown length distribution
- recursive branch levels
- down-angle and phyllotactic rotation
- taper / flare
- pipe-model radius relationship

### Three.js r186 TreeGenerator
- https://threejs.org/docs/pages/TreeGenerator.html
- r186 `examples/jsm/generators/TreeGenerator.js`

Adopted:
- deterministic seed
- parallel-transport swept tubes
- golden-angle siblings
- nonlinear taper
- root flare
- gravity droop
- phototropic up-pull
- foliage separate from wood

### SeedThree White Oak
- https://github.com/SkyeShark/SeedThree
- `src/species/white-oak.js`
- `src/core/leaf-cards.js`

Morphology anchors observed:
- scale 13
- ratio .035
- baseSize .18
- spherical crown
- flare .8
- attractionUp .7
- L1/L2 down angles around 68 / 55 degrees
- strong branch curvature/variance
- single leaves near
- base-anchored leaf cards
- phyllotactic leaf roll

Prototype 02 does not copy SeedThree code. It uses the published parameter direction and independently implements the same established morphology/rendering ideas in this WebGL one-page project.

## Deferred best practice

- dome/spherical foliage normals
- diffuse transmission / SSS
- GPU procedural wind
- branch-card mid LOD
- cross-plane impostor far LOD
