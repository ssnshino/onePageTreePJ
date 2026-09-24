# BEDFORD OAK REAL-TREE REFERENCE — WORKLOG

Updated: 2026-09-24T23:08:00+09:00

## Branch / PR
- Branch: `feature/tree-lab-bedford-oak-reference`
- Base: `feature/tree-lab-open-grown-white-oak`
- Draft PR: `#9`

## Research-first target selection

Several monumental oaks were reviewed.

### Bedford Oak — primary target
Species: `Quercus alba`

Why selected:
- same species family already targeted by the current generator
- living old White Oak
- multiple photographs exist
- 2022 Wikimedia Commons photograph has explicit measurement metadata
- very broad crown strongly exposes whether the procedural tree is too tall/narrow

2022 photo metadata:
- height: 69 ft
- average spread: over 120 ft
- circumference at 4.5 ft: 21 ft 3 in

Normalized targets:
- spread / height >= 1.739
- trunk diameter / height ~= 0.098

Reference:
https://commons.wikimedia.org/wiki/File:Bedford_Oak,_October_2022.jpg

Bedford Historical Society:
- estimated over 500 years old
- branch spread reported around 130 ft tip-to-tip

Reference:
https://www.bedfordhistoricalsociety.org/bedford-oak

The published girth values differ. They are not silently reconciled.
For normalized ratio QA, the 2022 Commons measurement is used because the circumference measurement height is explicit.

### Wye Oak — secondary reference
Maryland DNR documents:
- height 96 ft
- spread 119 ft
- circumference 31 ft 8 in
- massive knees/buttresses
- sweeping boughs

Used as a secondary reference for root/buttress weight, not the main silhouette target.

## TREE LAB implementation

Added morphology option:
- `BEDFORD OAK 2022 — PHOTO MATCH`

Added real-tree reference panel:
- direct photo link
- source measurement facts
- target spread/height
- live model spread/height
- target trunk-diameter/height
- live model trunk-diameter/height
- front + silhouette comparison shortcut

Crown-spread control range increased to support extreme broad-canopy experiments.

## Candidate parameter mapping

The procedural values are NOT photogrammetric measurements.
They are a first mapping constrained by the real-tree ratios:

- height 10.50
- trunk radius 0.52
- trunk clear 0.10
- root flare 1.18
- junction collar 0.34
- primary count 10
- primary angle 81 deg
- crown spread 0.80
- L1 gnarl 0.135
- L2 gnarl 0.240
- tip up-pull 0.16
- leaves/twig 12
- leaf size 0.42

## CI

GitHub Actions run:
`36010044269`

Job result:
**SUCCESS**

- build: PASS
- artifact upload: PASS
- main verify: PASS
- TREE LAB verify: PASS

## Next Human review

1. Select `BEDFORD OAK 2022 — PHOTO MATCH`
2. Open the reference photo
3. Use FRONT + SILHOUETTE CHECK
4. Compare crown width, low scaffold limbs, trunk mass, asymmetry and sky gaps
5. Adjust until model ratio and visual silhouette both converge
