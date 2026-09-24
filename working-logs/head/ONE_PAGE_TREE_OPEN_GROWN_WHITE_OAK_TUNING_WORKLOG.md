# OPEN-GROWN WHITE OAK TUNING — WORKLOG

Created: 2026-09-24T21:15:00+09:00

## Why

The TREE LAB made it clear that the next useful step is not random slider movement but a morphology-driven A/B comparison.

## Research

Current White Oak references consistently support:
- broad rounded mature crown
- wide horizontal spreading branches
- dense foliage
- open-grown short stocky bole / rugged crown

## Implementation

Added two previously hidden morphology controls:
- `TRUNK CLEAR` -> `spec.trunkClear`
- `CROWN SPREAD` -> `spec.lengthRatio[0]`

Added morphology selector:
- CURRENT v0.6
- OPEN-GROWN WHITE OAK
- CUSTOM

The OPEN-GROWN numeric values are explicitly experimental project tuning values, not botanical measurements quoted from sources.

No production OLD_OAK_SPEC default is changed in this phase.
The lab compares the candidate against the current baseline first.
