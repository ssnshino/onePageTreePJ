# CROWN FILL PASS 01 — HYBRID SPACE COLONIZATION

Created: 2026-09-25T12:06:00+09:00

## Research basis

Runions, Lane & Prusinkiewicz (2007):
- each attraction point influences the nearest tree node within radius of influence
- a tree node influenced by one or more points grows a new segment
- growth direction is the normalized average of normalized vectors toward its assigned attraction points
- segment length D is fixed for each iteration
- attraction points within kill distance are removed
- optional tropism/weight bias may be added to the growth vector

Reference:
https://algorithmicbotany.org/papers/colonization.egwnp2007.pdf

Practical implementations commonly expose:
- attraction / influence radius
- kill distance
- segment length
- iteration count

A recent implementation summary also uses an ellipsoid crown envelope and the same nearest-node / average-direction loop:
https://github.com/jakobrichert/space-colonization

## Project decision

Do NOT replace the current OLD_OAK generator.

Instead:
1. build the current Weber–Penn-like OLD_OAK skeleton
2. create the same deterministic crown attraction cloud used by the diagnostic
3. remove points already reached by the existing skeleton
4. assign remaining points to nearest terminal tips within an influence radius
5. rank tips by number of claimed targets
6. extend only the top N terminal tips by one short segment
7. cap the turn angle so growth does not become tentacle-like
8. remove reached targets
9. optionally repeat for 3 passes
10. run the existing bark geometry and foliage pipelines on the augmented skeleton

This is a hybrid corrective growth layer.

## Default experiment ratios

- influence radius ≈ 4.2 × segment length
- kill distance ≈ 1.8 × segment length
- direction keeps strong continuity with the existing terminal tangent
- max turn per pass ≈ 34 degrees

These are project experiment values informed by SCA literature/implementations, not botanical constants.

## UI

Minimal controls only:
- 1回育てる
- 3回育てる
- 成長を戻す
- 1ステップの長さ
- 同時に育てる枝先数

Growth-pass count is ephemeral and intentionally not stored in the saved preset yet.
