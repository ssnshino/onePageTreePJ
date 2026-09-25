# CROWN FILL PASS 01 PLAN

Created: 2026-09-25T12:06:00+09:00

## Goal
Prove that diagnosed uncovered crown space can cause visible corrective branch growth.

## Scope
TREE LAB only.

The production one-page world does not bundle `src/tree-lab/crown-fill.js`.

## Pass algorithm
For each pass:
1. generate deterministic attraction cloud
2. cull points already reached by skeleton
3. consider terminal stems level >= 2
4. assign each active point to its nearest eligible tip inside influence radius
5. average unit attraction vectors for each influenced tip
6. blend with current tangent + slight upward bias
7. cap turn angle
8. rank candidates by claimed target count
9. extend top N tips one segment
10. replace grown parents in terminal-stem list with their new child
11. kill newly reached targets

## Acceptance
- 1 PASS visibly moves some branch tips toward uncovered regions
- 3 PASS further reduces uncovered target count
- branches remain continuous rather than forming straight tentacles
- existing leaf generator places foliage on new terminal tips
- RESET restores exact base skeleton
- mobile remains interactive

## Non-goals
- full tree regeneration with pure SCA
- automatic continuous simulation
- final branch thickening model for grown correction stems
- production merge
