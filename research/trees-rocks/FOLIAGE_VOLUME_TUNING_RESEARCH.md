# FOLIAGE VOLUME TUNING — RESEARCH NOTE

Created: 2026-09-25T00:24:00+09:00

## Human finding

Bedford/Oak skeleton quality improved substantially, but the canopy reads too sparse / semi-deciduous.
The next realism bottleneck is foliage volume rather than branch morphology.

## External best-practice direction

### Distribution along branches

Unity Tree foliage controls expose leaf Distribution and curve-driven controls along branches/trunks.
This supports treating foliage as a distribution problem rather than only a leaf-count problem.

Reference:
https://docs.unity3d.com/Manual/tree-Leaves.html

### Hierarchical foliage / leaf clusters

Interactive tree-rendering literature commonly groups leaves/branches hierarchically for visual mass and LOD.
Leaf-cluster impostor work likewise treats groups of leaves as coherent spatial units instead of unrelated random quads.

References:
- https://doi.org/10.2312/EGWR/EGWR01/183-196
- https://doi.org/10.2312/egs.20051026

### Perceptual tree realism

ICTree reports branch angles, lengths and widths as critical features for perceived tree realism.
Those are now substantially improved; foliage distribution is therefore tuned without discarding the improved skeleton.

Reference:
https://doi.org/10.1145/3478513.3480519

## Project implementation

Foliage volume is split into independent controls:

- CANOPY DENSITY
  global leaf count multiplier

- INNER FILL
  adds reduced-density foliage to level-2 interior stems

- CLUMP SPAN
  controls how far leaf masses extend back along each twig/stem

- DEAD BRANCH FRACTION
  deliberately leaves whole twigs bare

- LOWER CROWN FILL
  controls foliage density on lower crown branches

- SKY GAP
  uses a coarse spatial hash to remove coherent foliage groups, producing crown holes instead of uniformly thinning every twig

## Presets

### CURRENT / SPARSE
Existing baseline.

### WINTER-ish
Strong branch visibility, sparse foliage.

### SUMMER
Primary target for Bedford Oak comparison.

### DENSE CANOPY
Intentional upper bound to identify when the crown becomes unrealistically solid.

## Principle

The target is not maximum leaf count.
The target is a believable 3D crown with:
- dense enough mass to read as summer foliage
- darker inner volume
- persistent branch visibility
- coherent sky gaps
- some dead wood
