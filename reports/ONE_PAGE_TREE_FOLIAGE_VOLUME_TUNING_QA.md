# FOLIAGE VOLUME TUNING — QA

Created: 2026-09-25T00:28:00+09:00

## CI
GitHub Actions run:
`36020030281`

Conclusion:
**SUCCESS**

| Check | Result |
|---|---|
| main one-page build | PASS |
| TREE LAB build | PASS |
| main verify | PASS |
| TREE LAB verify | PASS |
| artifact upload | PASS |
| foliage distribution source parses | PASS |
| TREE LAB source parses | PASS |
| no runtime CDN/import-map regression | PASS |

## New control path

Verified in source/build:
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

## Distribution implementation

- terminal stems: primary foliage
- non-terminal level-2 stems: optional INNER FILL foliage
- coarse spatial hash: coherent SKY GAP removal
- complete stem/twig omission: DEAD BRANCH FRACTION
- height weighting: LOWER CROWN FILL
- occupied stem range: CLUMP SPAN
- all leaves remain instanced and base-anchored

## Performance

Leaf count can now rise substantially in SUMMER/DENSE modes.
TREE LAB already reports:
- FPS
- total triangles
- draw calls
- geometry count
- texture count
- leaf count
- leaf-group count

Human performance review is required before promoting dense foliage to the main world.

## Visual QA remains Human authority

Automatic QA cannot decide:
- whether the summer crown is dense enough
- whether inner fill becomes too muddy
- whether sky gaps look natural
- whether branch visibility remains believable
- whether DENSE crosses the line into a solid green blob
