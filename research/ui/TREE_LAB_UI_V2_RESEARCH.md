# TREE LAB UI v2 — INSPECTOR RESEARCH

Created: 2026-09-24T14:20:00+09:00

## Goal

Keep the tree as the visual priority while preserving fast access to many tuning parameters.

## Apple HIG

### Panels
Apple describes panels as supplementary controls/information related to the active content, and explicitly recommends simple direct adjustment controls such as sliders for inspectors.

Reference:
https://developer.apple.com/design/human-interface-guidelines/panels

Applied:
- floating Inspector on wide screens
- compact title
- restrained dark/translucent appearance
- sliders remain the primary adjustment control

### Segmented controls
Apple recommends segmented controls for closely related choices affecting one object/state/view, and warns against mixing selection-state segments with unrelated momentary actions.

Reference:
https://developer.apple.com/design/human-interface-guidelines/segmented-controls

Applied:
- 3/4 / Front / Side / Top are one segmented view control
- display toggles and preset actions are separate groups

### Split views / hidden panes
Apple recommends allowing panes to hide when it gives more room to editing content, and providing multiple ways to restore hidden panes, including shortcuts.

Reference:
https://developer.apple.com/design/human-interface-guidelines/split-views

Applied:
- Inspector collapse
- persistent edge/bottom restore tab
- keyboard shortcut `I`

Note:
Apple's macOS Panel guidance does not directly prescribe a mobile bottom sheet. The mobile bottom-sheet layout here is a project-specific responsive adaptation to keep the 3D viewport dominant on compact screens.

## Blender

Blender's 3D Viewport Sidebar contains object/editor settings and is toggled with `N`. Older/current manuals also document that hidden regions retain a small affordance for reopening.

Reference:
https://docs.blender.org/manual/en/latest/interface/window_system/regions.html

Applied:
- Inspector keyboard toggle
- collapsed restore affordance remains visible

## Tweakpane

Tweakpane uses folders for parameter grouping and supports state export/import.

References:
https://tweakpane.github.io/docs/quick-tour/
https://tweakpane.github.io/docs/misc/

Applied:
- disclosure groups: Tree / Branches / Foliage / Roots & Joints / Advanced
- UI/value state persisted in localStorage
- explicit Save / Load preset
- Copy JSON for promotion into source presets

## Accessibility / interaction decisions

- native `details/summary` for disclosure
- native `input type=range`
- `aria-pressed` for view/toggle state
- >=44px mobile action targets
- inspector can be restored without relying solely on keyboard
