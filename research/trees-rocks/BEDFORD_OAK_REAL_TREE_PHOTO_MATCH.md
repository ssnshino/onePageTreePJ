# BEDFORD OAK — REAL TREE PHOTO MATCH STUDY

Created: 2026-09-24T23:02:00+09:00

## Primary target

Bedford Oak, Bedford, New York
Species: White Oak (`Quercus alba`)

## Why this tree

The project already targets White Oak morphology.
Bedford Oak is:
- a living, documented White Oak
- estimated by the Bedford Historical Society to be over 500 years old
- photographed from multiple dates/angles
- available in a 2022 high-resolution Wikimedia Commons photograph under CC BY-SA 4.0
- unusually broad for its height, which directly addresses the current generator's tall/narrow tendency

## Measurement source used for normalized targets

Wikimedia Commons 2022 photograph metadata:
- circumference at 4.5 ft: 21 ft 3 in
- height: 69 ft
- average spread: over 120 ft

Source:
https://commons.wikimedia.org/wiki/File:Bedford_Oak,_October_2022.jpg

Derived normalized targets:
- spread / height >= 120 / 69 = 1.739
- diameter / height ~= (21.25 / pi) / 69 = 0.098

These normalized ratios allow the procedural model to be compared despite using arbitrary world units.

## Historical source

Bedford Historical Society:
- estimated over 500 years old
- states branch spread about 130 ft tip to tip
- publishes a larger girth figure than the 2022 Wikimedia measurement

Source:
https://www.bedfordhistoricalsociety.org/bedford-oak

The girth figures are not silently reconciled because the measurement conventions/date are not equivalent in the sources.
For model ratio QA, the 2022 photo metadata is used because its measurement height is stated explicitly.

## Secondary reference

Wye Oak, Maryland:
- historic champion White Oak
- Maryland DNR records 96 ft height, 119 ft spread, 31 ft 8 in circumference
- DNR specifically describes massive knees/buttresses and sweeping boughs

Sources:
https://dnr.maryland.gov/publiclands/pages/eastern/wyeoak/wye-oak-tree.aspx
https://dnr.maryland.gov/forests/pages/trees/giant.aspx

Use:
- secondary reference for buttress/root weight
- Bedford Oak remains the primary silhouette target

## TREE LAB additions

- BEDFORD OAK 2022 morphology candidate
- reference photo link
- target real-tree ratios
- live model spread/height ratio
- live model trunk-diameter/height ratio
- front + silhouette comparison shortcut

## Important limitation

The Bedford preset numeric values are not a reconstruction from photogrammetry.
They are a first procedural parameter mapping constrained by real-tree measurements.
Human photo comparison remains the visual authority.
