# CROWN FILL PASS 01 — WORKLOG

Updated: 2026-09-25T12:12:00+09:00

## Branch / PR
- Branch: `feature/tree-lab-crown-fill-pass-01`
- Base: `feature/tree-lab-canopy-targets-jp-ui`
- Draft PR: `#12`

## Trigger

TREE LAB Phase 0 made uncovered crown space visible with attraction points.
The next experiment asks whether that diagnosed empty space can actually drive corrective growth.

## Research basis

Runions, Lane & Prusinkiewicz (2007):
- assign attraction points to the nearest eligible tree node within an influence radius
- average normalized vectors from the node toward assigned points
- extend a fixed-length segment in the resulting direction
- remove attraction points reached within kill distance
- repeat

Reference:
https://algorithmicbotany.org/papers/colonization.egwnp2007.pdf

A practical modern implementation exposes the same core parameters:
- point count
- influence radius
- kill distance
- segment length
- iteration count

Reference:
https://github.com/jakobrichert/space-colonization

## Project architecture

A new TREE LAB-only source was added:
`src/tree-lab/crown-fill.js`

It is bundled by `scripts/build-tree-lab.mjs` only.

The production world build does NOT include this corrective-growth experiment.

## Hybrid corrective growth

The current OLD_OAK skeleton is generated first.

For each requested pass:
1. deterministic Bedford-like crown attraction cloud is generated
2. targets already reached by the current skeleton are removed
3. terminal stems at level >= 2 are eligible growth tips
4. each active attraction point selects the nearest eligible tip inside influence radius
5. each influenced tip averages attraction directions
6. attraction direction is blended with existing tip tangent and a small upward bias
7. the turn angle is capped to reduce tentacle-like artifacts
8. influenced tips are ranked by number of claimed targets
9. top N tips receive one short extension stem
10. grown parent tips are replaced by their new child tips in `terminalStems`
11. newly reached attraction points are removed

The existing wood mesh and foliage generator then operate on the augmented skeleton without a second rendering path.

## Default experiment values

- segment length: 0.68
- influence radius: ~4.2D
- kill distance: ~1.8D
- continuity bias: strong
- max turn: ~34 degrees
- simultaneous growth tips: 10

These are project tuning values informed by SCA literature/implementations, not botanical constants.

## UI

Added to the existing Japanese `空間充填（逆フラクタル実験）` section:

- `1回育てる`
- `3回育てる`
- `成長を戻す`
- `1ステップの長さ`
- `同時に育てる枝先数`
- pass count
- added branch count
- remaining attraction point count

No AUTO growth yet.

## CI

Initial CI:
- build: PASS
- main verify: PASS
- TREE LAB verify: false failure caused by searching for an unminified function name

Verifier was changed to use minify-safe UI/runtime markers.

Final pre-squash CI:
- run `36089130633`
- main build: PASS
- TREE LAB build: PASS
- main verify: PASS
- TREE LAB verify: PASS
- artifact upload: PASS

## Human acceptance gate

Need to confirm:
1. 1 PASS moves visible tips toward uncovered regions
2. 3 PASS reduces uncovered targets further
3. new branches visually continue old branches
4. no straight tentacle artifacts
5. foliage appears on the new terminal tips
6. reset restores the base tree
7. mobile performance stays acceptable
