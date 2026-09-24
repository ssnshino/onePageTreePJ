# TREE LAB — BRANCH JUNCTION / FOLIAGE TUNING RESEARCH

Created: 2026-09-24T13:53:00+09:00

## Human visual finding
Prototype 02 environment improved, but the tree still exposes:
- tube-like branches
- hard branch/trunk intersections
- weak root/branch collars
- foliage-card character

## External research
### Branch junctions
Procedural/tree modeling literature and production workflows treat branch junctions as a separate quality problem rather than accepting raw intersecting cylinders.

Useful patterns:
- enlarge/shape the child base to align with the parent
- blend transition normals/UV/material around the intersection
- continuous or subdivision mesh when maximum quality is required
- junction collar/bulge is a useful low-cost approximation before continuous mesh work

References:
- https://www.sciencedirect.com/science/article/abs/pii/S1524070304000025
- https://www.sidefx.com/docs/houdini/nodes/sop/labs--tree_branch_generator-1.2.html

### Leaf overdraw
Alpha-tested foliage remains standard, but oversized transparent quads increase overdraw.
The card mesh should fit the leaf silhouette reasonably closely.

Reference:
- https://ebrary.net/206168/computer_science/branch_intersection_blending

## Prototype experiment
TREE LAB adds:
- junction-collar strength control
- trimmed oak-leaf mesh
- isolated tree review
- orthographic-like fixed view presets
- silhouette and wireframe review
- wood/leaves/roots visibility toggles
- direct morphology sliders
- renderer performance metrics

This lab is a tuning instrument. Final visual decisions remain Human review.
