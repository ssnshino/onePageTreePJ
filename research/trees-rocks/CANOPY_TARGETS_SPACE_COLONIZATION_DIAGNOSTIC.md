# CANOPY TARGETS / SPACE COLONIZATION DIAGNOSTIC — RESEARCH

Created: 2026-09-25T10:15:00+09:00

## Human observation
After foliage-volume tuning, one half of the crown can become fully foliated while the opposite half remains abruptly empty.
The limiting factor is no longer leaf count: the supporting branch skeleton itself can fail to occupy a large azimuth sector.

## Space Colonization basis
Runions, Lane and Prusinkiewicz (2007), "Modeling Trees with a Space Colonization Algorithm":
- takes a 3D crown envelope as input
- seeds attraction points inside the envelope
- attraction points represent free space available for growth
- branches extend toward nearby attraction points
- reached attraction points are removed
- attraction-point density can be biased toward the crown surface
- crown form emerges from growth interacting with the spatial target

Source:
https://algorithmicbotany.org/papers/colonization.egwnp2007.pdf

This matches the project's informal "逆マンデルブロー / 逆フラクタル" intuition:
instead of only applying local recursive rules and accepting the result,
first define desired occupied crown space and measure what the skeleton has not reached.

## Phase 0 implemented
This branch does NOT replace OLD_OAK with full Space Colonization yet.

It adds:
1. Bedford-like oblate crown envelope
2. attraction points inside the envelope
3. surface-biased point distribution
4. covered/uncovered classification from current branch samples
5. green covered points
6. orange/red uncovered points
7. 12-sector primary-branch azimuth coverage
8. maximum empty azimuth gap
9. arrow toward the largest empty direction

## Coverage guard experiment
New OLD_OAK parameter: `azimuthBalance`

- 0.0 = existing golden-angle + jitter scaffold
- 1.0 = primary branches blend toward evenly divided 360-degree sectors
- only primary branches are corrected
- default 0 preserves the existing production baseline

## Next phase
If the diagnostic is useful, uncovered attraction points can become actual growth targets:
assign uncovered points to branch tips, average attraction directions, extend iteratively, and remove reached points.
That becomes the true Weber–Penn × Space Colonization hybrid.
