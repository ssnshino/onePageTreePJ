# FOLIAGE VOLUME TUNING — WORKLOG

Updated: 2026-09-25T00:28:00+09:00

## Branch / PR
- Branch: `feature/tree-lab-foliage-volume-tuning`
- Base: `feature/tree-lab-bedford-oak-reference`
- Draft PR: `#10`

## Human finding

The Bedford/Oak trunk and branch skeleton now reads much more like a real old tree, but the crown remains too sparse and winter-like.

The next quality target is therefore canopy volume, not another skeleton rewrite.

## Research translated into implementation

### Distribution along branches
Tree authoring systems expose foliage distribution along the supporting branch/stem rather than treating leaf count as the only control.

Applied:
- `CLUMP SPAN` controls how far foliage extends back along the support stem.

### Canopy volume
The generator now separates multiple factors that were previously collapsed into `LEAVES / TWIG`:

- `CANOPY DENSITY`
- `INNER FILL`
- `CLUMP SPAN`
- `DEAD BRANCH FRACTION`
- `LOWER CROWN FILL`
- `SKY GAP`
- `LEAVES / TWIG`
- `LEAF SIZE`

## Foliage distribution changes

### Terminal foliage
Terminal twigs remain the primary foliage carriers.

### Inner fill
Level-2 non-terminal stems may receive reduced-density foliage.
This thickens the canopy interior without replacing branch structure with a solid leaf wall.

### Spatial sky gaps
A coarse quantized spatial hash removes entire nearby foliage groups coherently.
This creates real crown holes instead of uniformly deleting individual leaves.

### Dead branches
Whole twigs/stems may intentionally remain bare.
This preserves the old-tree character even in summer foliage.

### Lower crown fill
Foliage density is weighted by terminal height so lower scaffold branches can be filled independently.

### Clump span
Leaf placement remains base-anchored to real branch frames, but the occupied part of the twig/stem can expand or contract.

## Foliage presets

### CURRENT / SPARSE
Baseline behavior.

### WINTER-ish
- low density
- low inner fill
- high sky gap
- higher bare-branch fraction

### SUMMER
Primary visual target:
- higher canopy density
- medium/high inner fill
- lower sky gap
- old branches still visible

### DENSE CANOPY
Intentional upper-bound test:
- very high density
- high inner fill
- minimal sky gap
- almost no bare branches

This preset is not assumed to be realistic; it is used to establish the overfilled limit.

## Visual isolation

Added independent `WOOD` display toggle.

TREE LAB can now review:
- branches only
- leaves only
- full tree

without using separate fake geometry.

## CI

GitHub Actions run:
`36020030281`

Result:
**SUCCESS**

- main one-page build: PASS
- TREE LAB build: PASS
- main verify: PASS
- TREE LAB verify: PASS
- artifact upload: PASS

## Next Human review

Recommended sequence:
1. Bedford Oak morphology
2. SUMMER foliage
3. inspect full tree
4. hide WOOD and inspect foliage mass alone
5. compare SUMMER vs DENSE
6. tune SKY GAP
7. tune INNER FILL
8. tune LOWER CROWN FILL
9. only then adjust individual leaf size/count
