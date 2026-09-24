# TREE LAB UI v2 SPEC

Created: 2026-09-24T14:20:00+09:00

## Desktop
- floating Inspector, approximately 360px
- collapses off-canvas
- restore edge tab remains visible
- compact performance HUD
- 3D viewport remains full-size

## Mobile
- Inspector becomes bottom sheet
- maximum height about 78dvh
- collapsed state uses bottom pill
- swipe-down on handle closes sheet
- touch controls target at least 44px

## Information architecture
1. View segmented control
2. Tree
3. Branches
4. Foliage
5. Roots & Joints
6. Advanced
7. Display toggles
8. Preset tools

## Persistence
Auto-persist:
- current parameter values
- inspector collapse state
- accordion disclosure state
- current fixed view
- performance panel open/closed

Explicit preset:
- Save one tuning preset
- Load saved preset
- Copy current values as JSON

## Keyboard
- I Inspector
- H UI
- 1–4 views
- W wireframe
- S silhouette

## Non-goals
- changing tree-generation morphology in this phase
- adding a UI framework dependency
- mimicking Apple visual styling pixel-for-pixel

The goal is interaction hierarchy and viewport priority, not platform cosplay.
