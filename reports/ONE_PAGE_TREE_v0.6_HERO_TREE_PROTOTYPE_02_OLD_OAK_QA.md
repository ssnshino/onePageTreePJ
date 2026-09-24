# HERO TREE PROTOTYPE 02 — OLD OAK QA

Created: 2026-09-24T13:32:00+09:00

## Source / Build

| Check | Result |
|---|---|
| split-source application syntax | PASS |
| old oak species preset present | PASS |
| Weber/Penn-style spherical crown profile | PASS |
| pipe-model child radius | PASS |
| golden-angle branch distribution | PASS |
| terrain-following roots | PASS |
| individual oak leaf generator | PASS |
| base-anchored leaf placement | PASS |
| foliage InstancedMesh | PASS |
| r186 one-page build | PASS |
| dist verify | PASS |

GitHub Actions run:
`35955885981`

Conclusion:
**SUCCESS**

## Output

`dist/threejs_onepage_waterworld_v0.6_hero_tree_prototype_02_old_oak.html`

Approximate uncompressed HTML size:
**601 KiB**

## Runtime Metrics Added

Human screenshots can now report:
- FPS
- TRI
- CALL
- GEO
- TEX
- DPR
- reflection size

This enables visual quality decisions to be compared against actual rendering cost.

## Visual QA

Automatic QA does not decide whether the result looks like a real old oak.

Human review required for:
1. trunk and buttress weight
2. broad/rounded crown
3. non-planar primary branch distribution
4. secondary branch naturalness
5. individual leaf readability vs card artifact
6. sky gaps
7. reflection integration
8. PC performance
9. smartphone performance
