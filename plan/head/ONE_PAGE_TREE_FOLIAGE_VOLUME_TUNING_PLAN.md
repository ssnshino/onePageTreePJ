# FOLIAGE VOLUME TUNING PLAN

Created: 2026-09-25T00:24:00+09:00

## Purpose

Make canopy volume tunable independently of OLD OAK morphology.

## TREE LAB controls

- CANOPY DENSITY
- INNER FILL
- CLUMP SPAN
- DEAD BRANCH FRACTION
- LOWER CROWN FILL
- SKY GAP
- LEAVES / TWIG
- LEAF SIZE

## Foliage presets

- CURRENT / SPARSE
- WINTER-ish
- SUMMER
- DENSE CANOPY
- CUSTOM

## Rendering / distribution changes

1. Terminal twigs remain the primary foliage carriers.
2. INNER FILL may add lower-density foliage to non-terminal level-2 stems.
3. SKY GAP removes coherent spatial groups via quantized position hashing.
4. DEAD BRANCH FRACTION leaves complete twigs/stems bare.
5. LOWER CROWN FILL weights density by terminal height.
6. CLUMP SPAN changes the occupied length of the supporting twig/stem.
7. Individual leaves remain base-anchored and instanced.

## Visual isolation

WOOD is now independently toggleable so:
- branches only
- leaves only
- full tree

can all be inspected without a new renderer path.

## Human sequence

1. Bedford morphology
2. SUMMER foliage
3. hide WOOD briefly to inspect canopy volume
4. restore WOOD and judge branch visibility
5. compare SUMMER vs DENSE
6. tune SKY GAP and INNER FILL last

## Success

The Bedford tree should no longer read as a mostly bare winter tree, while its improved trunk and scaffold structure remains visible.
